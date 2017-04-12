import {ChallengeType} from "./ChallengeType";
import {BaseChallenge} from "./BaseChallenge";
import {HealthKitService} from "../providers/healthkit-service";
import * as moment from "moment";
import {NotificationService} from "../providers/notification-service";

export class DistanceChallenge extends BaseChallenge {
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
        console.log('progress ' + progress);

        return progress >= this.completion.required || (this.start_time + this.completion.time) <= moment().unix();
    }

    updateChallengeProgress(_healthKitService: HealthKitService, _notificationsService: NotificationService, uid: any): Promise<any> {

        console.debug('updateChallengeProgress');
        let userIndex = this.participants.findIndex(participant => {
            return participant.id === uid
        });

        if( this.isComplete ){
            return Promise.reject('Challenge Complete');
        }

        if(moment().unix() >= this.start_time + this.completion.time)
        {
            if(this.participants[userIndex].failed)
            {
                return Promise.reject('failed');
            }
            return Promise.resolve({
                url: '/active_challenges/' + this.key + '/participants/' + userIndex,
                data: {
                    failed: true
                }
            });
        }


        return _healthKitService.getChallengeMetrics(this.type, this.start_time)
            .then(metricValue => {
                console.log('got data bruva', metricValue);
                let sent;
                let user = this.participants.find(user =>{return user.id == uid});
                metricValue = metricValue / 1000;
                if(user.progress != metricValue) {
                    let isComplete = this.checkIfComplete(metricValue);
                    let addXp = isComplete && !this.isComplete;
                        console.log(isComplete);
                    //mark as complete straight away so the UI changes before the db catch up
                    this.isComplete = isComplete;
                    if (!isComplete){
                        if(!user.notification) {
                            sent = true;
                            let message = this.getName() + ' is almost over';
                            _notificationsService.sendNotification(this.completion.time , message, this.getStartTime());
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
                    return Promise.reject(new Error("Progress not changed"));
                }
            }).catch(err => Promise.reject(err));
    }

    getLeader(participants: any){

    }

}
