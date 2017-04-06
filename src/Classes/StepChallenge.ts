import {ChallengeType} from "./ChallengeType";
import {IChallenge} from "./IChallenge";
import {BaseChallenge} from "./BaseChallenge";
import {HealthKitService} from "../providers/healthkit-service";
import * as moment from "moment";

export class StepsChallenge extends BaseChallenge {
    public isComplete : boolean = false;

    constructor(challengeObj: any, type: ChallengeType, uid : any) {
        super(challengeObj, type, uid);
        console.log('constructor');

        this.setCompleteState();
    }

    setCompleteState() : void {
        let user = this.participants.find( participant => participant.id === this.uid );

        this.isComplete = this.checkIfComplete( user.progress );
    }

    checkIfComplete( progress : any ) : boolean {
        return progress >= this.completion.required;
    }

    updateChallengeProgress(_healthKitService: HealthKitService, uid: any): Promise<any> {

        console.debug('updateChallengeProgress');

        if( this.isComplete ){
            return Promise.reject('Challenge Complete');
        }

        return _healthKitService.getChallengeMetrics(this.type, this.start_time)
            .then(metricValue => {
                console.debug('got data bruva', metricValue);
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
                else {
                    return Promise.reject(new Error("Progress not changed"));
                }
            }).catch(err => Promise.reject(err));
    }

}