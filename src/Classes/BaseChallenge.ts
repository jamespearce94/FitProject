import {ChallengeType} from "./ChallengeType";
import {HealthKitService} from "../providers/healthkit-service";
import {NotificationService} from "../providers/notification-service";


export abstract class BaseChallenge {

    protected type: ChallengeType;
    protected name: string;
    protected id: string;
    protected completion: any;
    protected description: string;
    protected image_url: string;
    protected xp: number;
    protected participants: Array<any> = [];
    protected start_time: number;
    protected host: string;
    protected key: string;
    protected active: boolean;
    protected uid: any;

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
        this.start_time = challengeObj.start_time;
        this.host = challengeObj.host;
        this.key = challengeObj.key;
        this.active = challengeObj.active;
    }

    abstract updateChallengeProgress(_healthKitService: HealthKitService, _notificationsService: NotificationService, uid: any): Promise<any>;

    abstract setCompleteState(): void;

    abstract checkIfComplete(progress: any): boolean;

    abstract checkIfCurrent(): boolean;

    getChallengeXP(): number {
        return this.xp;
    }

    getActiveStatus(): boolean {
        return this.active;
    }

    getCompletion(): any {
        return this.completion;
    }

    getName(): string {
        return this.name;
    }

    getStartTime(): number {
        return this.start_time;
    }

    sortParticipants(): void {
        this.participants.sort((participantA, participantB) => {

            if (participantA.progress > participantB.progress) {
                return 0
            }
            ;
            if (participantA.progress < participantB.progress) {
                return -1
            }
        });
    }
}