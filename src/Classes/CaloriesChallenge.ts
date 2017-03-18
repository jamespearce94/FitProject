import {BaseChallenge} from "./BaseChallenge";
import {ChallengeType} from "./ChallengeType";
import {IChallenge} from "./IChallenge";
import {HealthKitService} from "../providers/healthkit-service";
import * as moment from "moment";

export class CaloriesChallenge extends BaseChallenge implements IChallenge {
    public isComplete : boolean = false;

    constructor(challengeObj: any, type: ChallengeType, uid : any) {
        super(challengeObj, type, uid);

        this.setCompleteState();
    }

    setCompleteState() : void {
        let user = this.participants.find( participant => participant.id === this.uid );

        this.isComplete = this.checkIfComplete( user.progress );
    }

    checkIfComplete( progress : any ) : boolean {
        return progress >= this.completion;
    }

    updateChallengeProgress(_healthKitService: HealthKitService, uid: any): Promise<any> {
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

                    return {
                        url: '/active_challenges/' + this.key + '/participants/' + userIndex,
                        addXP: addXp,
                        data: {
                            progress: metricValue,
                            complete: isComplete,
                            last_update: moment().unix(),
                            complete_date: isComplete ? moment().unix() : null
                        }
                    };
                }
                else{
                    Promise.reject('Progress not changed');
                }
            }).catch(err => console.log(err));
    }

    getChallengeXP(): number{
        return this.xp;
    }

    getActiveStatus(): boolean{
        return this.active;
    }
}