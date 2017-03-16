import {ChallengeType} from "./ChallengeType";
import {IChallenge} from "./IChallenge";
import {BaseChallenge} from "./BaseChallenge";
import {HealthKitService} from "../providers/healthkit-service";

export class StepsChallenge extends BaseChallenge implements IChallenge {
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

                let isComplete = this.checkIfComplete(metricValue);
                let userIndex = this.participants.findIndex(participant => {
                    return participant.id === uid
                });

                return {
                    url: '/active_challenges/' + this.key + '/participants/' + userIndex,
                    data: {
                        progress: metricValue,
                        complete: isComplete
                    }
                };
            });
    }
    getChallengeXP(): number{
        return this.xp;
    }
    getActiveStatus(): boolean{
        return this.active;
    }
}