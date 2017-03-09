import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {UserService} from "./user-service";
import {HealthKitService} from "./healthkit-service";

@Injectable()
export class ChallengeService {

    constructor(public http: Http,
                private af: AngularFire,
                private _userService: UserService,
                private _healthkitService: HealthKitService) {
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
                start_time: challenge.pending_participants.length ? new Date() : null
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

    updateChallengeStepProgress(uid: string) {
        this.getChallengeList()
            .subscribe(allChallenges => {
                this.getActiveChallenges()
                    .map(listOfChallenges => {
                        let challenges = [];

                        if (!listOfChallenges) {
                            return [];
                        }
                        listOfChallenges.forEach(activeChallenge => {
                            if (!activeChallenge.pending_participants || activeChallenge.pending_participants
                                    .indexOf(uid) == -1) {
                                let isPresent = activeChallenge.participants.filter(participant => {
                                    return participant.id === this._userService.user.auth.uid;
                                }).length;

                                if (isPresent) {
                                    let matchingChallenge = allChallenges.find(challenge => {
                                        return challenge.$key === activeChallenge.id
                                    });
                                    activeChallenge.type = matchingChallenge.type;
                                    challenges.push(activeChallenge);
                                    console.log(challenges);
                                }
                            }
                        });
                        return challenges;
                    })
                    .subscribe(listOfChallenges => {
                        console.log('subscribe');
                        listOfChallenges.forEach(userChallenge => {
                            this._healthkitService.getChallengeSteps(userChallenge.last_update)//ToDo replace with start time
                                .then(steps => {
                                    console.log('getChallengeSteps', steps);
                                    userChallenge.participants.forEach((participant, index) => {
                                        debugger;
                                        if (uid == participant.id && userChallenge.type == "Steps" && userChallenge.active) {
                                            this.af.database.object('/active_challenges/' +
                                                userChallenge.$key + '/participants/' + index)
                                                .update({
                                                    progress: steps
                                                });
                                        }
                                    })
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        });

                    });
            });

    }

}
