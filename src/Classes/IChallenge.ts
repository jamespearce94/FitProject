import {HealthKitService} from "../providers/healthkit-service";

export abstract class IChallenge {
    abstract updateChallengeProgress( _healthKitService : HealthKitService, uid : any ) : Promise<any>;
    abstract setCompleteState() : void;
    abstract checkIfComplete( progress : any ) : boolean;
}