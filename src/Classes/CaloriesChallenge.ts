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

    setCompleteState() : void {
        let user = this.participants.find( participant => participant.id === this.uid );

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
                let user = this.participants.find(user =>{return user.id == uid});
                if(user.progress != metricValue) {
                    let isComplete = this.checkIfComplete(metricValue);
                    let addXp = isComplete && !this.isComplete;

                    //mark as complete straight away so the UI changes before the db catch up
                    this.isComplete = isComplete;
                    let userIndex = this.participants.findIndex(participant => {
                        return participant.id === uid
                    });

                    return Promise.resolve({
                        url: '/active_challenges/' + this.key + '/participants/' + userIndex,
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