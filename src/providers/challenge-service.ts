import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {UserService} from "./user-service";

@Injectable()
export class ChallengeService {

    constructor(public http: Http,
                private af: AngularFire,
                private _userService: UserService) {
    }

    getChallengeList(): FirebaseListObservable<any> {
        return this.af.database.list('/challenge_list')
    }

    getActiveChallenges(): FirebaseListObservable<any> {
        return this.af.database.list('/active_challenges')
    }

    acceptChallenge(challenge): firebase.Promise<any> {
        return this.af.database.object('/active_challenges/' + challenge.$key)
            .update({
                pending_participants: challenge.pending_participants
                    .filter(p => p !== this._userService.user.auth.uid),
                active: challenge.pending_participants.length === 1,
                start_time: challenge.pending_participants.length ? new Date().getTime() : null
            });
    }

    rejectChallenge(challenge) {

    }

    createChallenge(participants: Array<any>, challenge: any) {
        let formattedParticipants = participants
            .map(participant => {
                return {
                    "id": participant,
                    "progress": 0,
                    "complete_time": null
                }
            }).concat([{
                "id": this._userService.user.auth.uid,
                "progress": 0,
                "complete_time": null
            }]);

        this.af.database.list('/active_challenges')
            .push({
                "active": false,
                "start_time": null,
                "id": challenge.$key,
                "host": this._userService.user.auth.displayName,
                "pending_participants": participants,
                "participants": formattedParticipants
            });
    }

}
