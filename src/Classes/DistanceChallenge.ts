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

        this.setCompleteState();
    }

    setCompleteState(): void {
        let user = this.participants.find(participant => participant.id === this.uid);

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
        let userIndex = this.participants.findIndex(participant => {
            return participant.id === uid
        });

        if (this.isComplete) {
            return Promise.reject('Challenge Complete');
        } else if( this.isExpired && !this.participants[userIndex].failed ) {
            return Promise.resolve({
                url: '/active_challenges/' + this.key + '/participants/' + userIndex,
                data: {
                    failed: !this.participants[userIndex].failed
                }
            });
        }

        return _healthKitService.getChallengeMetrics(this.type, this.start_time)
            .then(metricValue => {
                let sent = false;
                let user = this.participants.find(user => {
                    return user.id == uid
                });
                metricValue = metricValue / 1000;
                if (user.progress != metricValue) {
                    let isComplete = this.checkIfComplete(metricValue);
                    let addXp = isComplete && !this.isComplete;

                    //mark as complete straight away so the UI changes before the db catch up
                    this.isComplete = isComplete;
                    if (!isComplete) {
                        if (!user.notification) {
                            sent = true;
                            let message = this.getName() + ' is almost over';
                            _notificationsService.sendNotification(this.completion.time, message, this.getStartTime());
                        }
                    }

                    return Promise.resolve({
                        url: '/active_challenges/' + this.key + '/participants/' + userIndex,
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

    getLeader(participants: any) {

    }

}
