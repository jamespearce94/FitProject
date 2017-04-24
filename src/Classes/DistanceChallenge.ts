import {ChallengeType} from "./ChallengeType";
import {BaseChallenge} from "./BaseChallenge";
import {HealthKitService} from "../providers/healthkit-service";
import * as moment from "moment";
import {NotificationService} from "../providers/notification-service";

export class DistanceChallenge extends BaseChallenge {
    public isComplete: boolean = false;
    public isExpired: boolean = false;

    constructor(challengeObj: any, type: ChallengeType, uid: any) {
        super(challengeObj, type, uid);

        //check if complete and sort straight away
        this.setCompleteState();
        this.sortParticipants();

    }

    sortParticipants(): void {
        // sort by progress and completion time
        this.participants.sort((participantA, participantB) => {
            const progA = participantA.progress;
            const progB = participantB.progress;

            if (progA && progB >= this.completion.required) {
                return (participantA.complete_date < participantB.complete_date) ? 1 : -1;
            }
            else {
                return (progA > progB) ? -1 : 1;
            }
        });
    }

    setCompleteState(): void {
        //check if challenge complete for logged in user
        let user = this.participants.find(participant => participant.uid === this.uid);

        this.isComplete = this.checkIfComplete(user.progress);
        this.isExpired = this.checkIfExpired();
    }

    checkIfComplete(progress: any): boolean {
        return progress >= this.completion.required;
    }

    checkIfExpired() {
        return (this.start_time + this.completion.time) <= moment().unix();
    }

    checkIfCurrent() {
        return !this.isComplete && !this.isExpired;
    }

    updateChallengeProgress(_healthKitService: HealthKitService, _notificationsService: NotificationService, uid: any): Promise<any> {
        // update challenge progress from healthkit
        let user = this.participants.find((user) => {
            return user.uid === uid
        });
        // If complete don't update
        if (this.isComplete) {
            return Promise.reject('Challenge Complete');
        }
        // If expired for the first time return failed and don't update stats
        else if (this.isExpired && !user.failed) {
            return Promise.resolve({
                url: '/active_challenges/' + this.key + '/participants/' + user.id,
                data: {
                    failed: !this.participants[user.id].failed
                }
            });
        }
        // if expired reject update
        else if (this.isExpired) {
            return Promise.reject('Expired');
        }

        return _healthKitService.getChallengeMetrics(this.type, this.start_time)
            .then(metricValue => {
                //healthkit callback function
                let sent = false;
                // convert to km
                metricValue = metricValue / 1000;
                if (user.progress != metricValue) {
                    let isComplete = this.checkIfComplete(metricValue);
                    let addXp = isComplete && !this.isComplete;
                    //mark as complete straight away so the UI changes before the db catch up

                    this.isComplete = isComplete;
                    if (!isComplete) {
                        // Schedule challenge reminder
                        if (!user.notification) {
                            sent = true;
                            let message = this.getName() + ' is almost over';
                            _notificationsService.sendNotification(this.completion.time, message, this.getStartTime());
                        }
                    }

                    return Promise.resolve({
                        url: '/active_challenges/' + this.key + '/participants/' + user.id,
                        addXP: addXp,
                        data: {
                            progress: metricValue,
                            complete: isComplete,
                            last_update: moment().unix(),
                            complete_date: isComplete ? moment().unix() : null,
                            notification: sent
                        }
                    });
                }
                else {
                    return Promise.reject('No Change');
                }
            }).catch(err => Promise.reject(err));
    }

}
