import {ChallengeType} from "./ChallengeType";


export class BaseChallenge {

    protected type : ChallengeType;
    protected name : string;
    protected id : string;
    protected completion : number;
    protected description :  string;
    protected image_url : string;
    protected xp : number;
    protected participants : Array<any> = [];
    protected start_time : number;
    protected host : string;
    protected key : string;
    protected active : boolean;
    protected uid : any;

    constructor(challengeObj, type, uid) {
        this.uid = uid;
        this.id = challengeObj.id;
        this.name = challengeObj.challenge_name;
        this.type = type;
        this.completion = challengeObj.completion;
        this.description = challengeObj.description;
        this.image_url = challengeObj.image_url;
        this.xp = challengeObj.xp;
        this.participants = challengeObj.participants;
        this.start_time =  challengeObj.start_time;
        this.host = challengeObj.host;
        this.key = challengeObj.key;
        this.active = challengeObj.active;
    }

    getChallengeXP(): number {
        return this.xp;
    }
}