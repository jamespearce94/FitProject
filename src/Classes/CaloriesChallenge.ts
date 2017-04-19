import {BaseChallenge} from "./BaseChallenge";
import {ChallengeType} from "./ChallengeType";
import {IChallenge} from "./IChallenge";
import {HealthKitService} from "../providers/healthkit-service";
import * as moment from "moment";
import {NotificationService} from "../providers/notification-service";

export class CaloriesChallenge extends BaseChallenge {
    public isComplete : boolean = false;

    constructor(challengeObj: any, type: ChallengeType, uid : any) {
        super(challengeObj, type, uid);

        this.setCompleteState();
        this.sortParticipants();
    }
         sortParticipants(): void {
        this.participants.sort((participantA, participantB) => {
            const progA = participantA.progress;
            const progB = participantB.progress;

            if(progA && progB >= this.completion.required) {
                return (participantA.complete_date < participantB.complete_date) ? 1 : -1;
            }
            else{
                return (progA > progB) ? -1 : 1;
            }
        });
    }


    setCompleteState() : void {
        let user = this.participants.find( participant => participant.uid === this.uid );

        this.isComplete = this.checkIfComplete( user.progress );
    }

    checkIfComplete( progress : any ) : boolean {
        return progress >= this.completion.required;
    }

    checkIfCurrent() {
        return !this.isComplete;
    }

    updateChallengeProgress(_healthKitService: HealthKitService,_notificationsService: NotificationService, uid: any): Promise<any> {
        return _healthKitService.getChallengeMetrics(this.type, this.start_time)
            .then(metricValue => {
                let user = this.participants.find(user =>{return user.uid == uid});
                if(user.progress != metricValue) {
                    let isComplete = this.checkIfComplete(metricValue);
                    let addXp = isComplete && !this.isComplete;

                    //mark as complete straight away so the UI changes before the db catch up
                    this.isComplete = isComplete;

                    return Promise.resolve({
                        url: '/active_challenges/' + this.key + '/participants/' + user.id,
                        addXP: addXp,
                        data: {
                            progress: metricValue,
                            complete: isComplete,
                            last_update: moment().unix(),
                            complete_date: isComplete ? moment().unix() : null
                        }
                    });
                }
                else{
                    return Promise.reject('No Change');
                }
            }).catch(err => console.log(err));
    }

}