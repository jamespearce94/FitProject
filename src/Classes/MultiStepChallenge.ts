import {ChallengeType} from "./ChallengeType";
import {BaseChallenge} from "./BaseChallenge";
import {HealthKitService} from "../providers/healthkit-service";
import * as moment from "moment";
import {NotificationService} from "../providers/notification-service";

export class MultiStepChallenge extends BaseChallenge {
    public isComplete: boolean = false;
    public isExpired: boolean = false;
    public step1Complete: boolean = false;
    public step2Complete: boolean = false;

    constructor(challengeObj: any, type: ChallengeType, uid: any) {
        super(challengeObj, type, uid);

        this.setCompleteState();
        this.sortParticipants();
    }

 sortParticipants(): void {
        this.participants.sort((participantA, participantB) => {
            const progA = participantA.step1.progress + participantA.step2.progress;
            const progB = participantB.step1.progress + participantB.step2.progress;

            if(progA && progB >= this.completion.step1 + this.completion.step2)
            {
                return (participantA.complete_date < participantB.complete_date) ? 1 : -1;
            }
            else{
                return (progA > progB) ? -1 : 1;
            }

        });
    }

    setCompleteState(): void {
        let user = this.participants.find(participant => participant.uid === this.uid);
        this.isComplete = this.checkIfComplete(user.step1.progress + user.step2.progress);
    }

    checkIfComplete(progress: any): boolean {
        return progress >= this.completion.step1 + this.completion.step2;
    }

    checkIfStep1Complete(progress: any): boolean {
        return progress >= this.completion.step1;
    }

    checkIfStep2Complete(progress: any): boolean {
        return progress - this.completion.step1 >= this.completion.step2;
    }

    checkIfCurrent() {
        return !this.isComplete && !this.isExpired;
    }

    updateChallengeProgress(_healthKitService: HealthKitService, _notificationsService: NotificationService, uid: any): Promise<any> {
        let user = this.participants.find((user) => {
            return user.uid === uid
        });

        if (this.isComplete) {
            return Promise.reject('Challenge Complete');
        } else if (this.isExpired && !this.participants[user.id].failed) {
            return Promise.resolve({
                url: '/active_challenges/' + this.key + '/participants/' + user.id,
                data: {
                    failed: !this.participants[user.id].failed
                }
            });
        }

        return _healthKitService.getChallengeMetrics('Steps', this.start_time)
            .then(metricValue => {
                let sent = false;

                if (user.step1.progress + user.step2.progress != metricValue) {
                    this.step1Complete = this.checkIfStep1Complete(metricValue);
                    if (this.step1Complete) {
                        this.step2Complete = this.checkIfStep2Complete(metricValue);
                    }
                    let isComplete = this.step1Complete && this.step2Complete;
                    let addXp = isComplete && !this.isComplete;

                    //mark as complete straight away so the UI changes before the db catch up
                    this.isComplete = isComplete;
                    if (this.step1Complete) {
                        return Promise.resolve({
                            url: '/active_challenges/' + this.key + '/participants/' + user.id,
                            addXP: addXp,
                            data: {
                                step1: {
                                    progress: metricValue > this.completion.step1 ? this.completion.step1 : metricValue,
                                    complete: this.step1Complete
                                },
                                step2: {
                                    progress: metricValue - this.completion.step1 > this.completion.step2 ? this.completion.step2 : metricValue - this.completion.step1,
                                    complete: this.step2Complete
                                },
                                complete: isComplete,
                                last_update: moment().unix(),
                                complete_date: isComplete ? moment().unix() : null,
                            }
                        });
                    }
                    else {
                        return Promise.resolve({
                            url: '/active_challenges/' + this.key + '/participants/' + user.id,
                            addXP: addXp,
                            data: {
                                step1: {
                                    progress: metricValue,
                                    complete: this.step1Complete
                                },
                                step2: {
                                    progress: 0,
                                    complete: false
                                },
                                complete: isComplete,
                                last_update: moment().unix(),
                                complete_date: isComplete ? moment().unix() : null,
                            }
                        });
                    }

                }
                else {
                    return Promise.reject('No Change');
                }
            }).catch(err => Promise.reject(err));
    }

    getLeader(participants: any) {

    }

}
