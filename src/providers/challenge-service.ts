import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {UserService} from "./user-service";
import {HealthKitService} from "./healthkit-service";
import * as moment from "moment";
import {ViewChallengeModal} from "../modals/view-challenge/view-challenge.modal";
import {ModalController} from "ionic-angular";
import {LevelService} from "./level-service";
import {ChallengeType} from "../Classes/ChallengeType";
import {IChallenge} from "../Classes/IChallenge";
import {StepsChallenge} from "../Classes/StepChallenge";
import {CaloriesChallenge} from "../Classes/CaloriesChallenge";

@Injectable()
export class ChallengeService {

    public challenges: Array<IChallenge> = [];

    constructor(public http: Http,
                private af: AngularFire,
                private modalCtrl: ModalController,
                private _userService: UserService,
                private _healthkitService: HealthKitService) {

        this.getChallengeList().take(1)
            .subscribe(allChallenges => {
                this.getActiveChallenges().take(1)
                    .map(listOfChallenges => {
                        let challenges = [];

                        if (!listOfChallenges) {
                            return [];
                        }

                        listOfChallenges.forEach(activeChallenge => {
                            if (!activeChallenge.pending_participants || activeChallenge.pending_participants
                                    .indexOf(this._userService.user.uid) == -1) {
                                let isPresent = activeChallenge.participants.filter(participant => {
                                    return participant.id === this._userService.user.auth.uid;
                                }).length;

                                if (isPresent) {
                                    let matchingChallenge = allChallenges.find(challenge => {
                                        return challenge.$key === activeChallenge.id
                                    });
                                    activeChallenge.key = activeChallenge.$key;
                                    Object.assign(activeChallenge, matchingChallenge);
                                    challenges.push(activeChallenge);
                                }
                            }
                        });
                        return challenges;
                    })
                    .subscribe(list => {
                        list.forEach(challenge => {
                            // console.log(challenge);
                            switch (challenge.type) {
                                case ChallengeType.STEPS: {
                                    this.challenges.push(new StepsChallenge(challenge,
                                        ChallengeType.STEPS, this._userService.user.uid));
                                    break;
                                }
                                case ChallengeType.CALORIES: {
                                    this.challenges.push(new CaloriesChallenge(challenge,
                                        ChallengeType.CALORIES, this._userService.user.uid));
                                    break;
                                }
                                default: {
                                    // this.challenges.push(new CaloriesChallenge(Object.assign(challenge, {type: 'Steps'})));
                                    // break;
                                }
                            }
                        });

                        this.updateChallengeProgress();
                    });
            });
    }

    getChallengeList(): FirebaseListObservable<any> {
        return this.af.database.list('/challenge_list');
    }

    getActiveChallenges(): FirebaseListObservable<any> {
        return this.af.database.list('/active_challenges');
    }

    acceptChallenge(challenge): firebase.Promise<any> {
        return this.af.database.object('/active_challenges/' + challenge.key)
            .update({
                pending_participants: challenge.pending_participants
                    .filter(p => p !== this._userService.user.auth.uid),
                active: challenge.pending_participants.length === 1,
                start_time: challenge.pending_participants.length ? new Date() : null
            });
    }

    rejectChallenge(challenge) {

    }

    viewChallenge(challenge): void {
        this.modalCtrl.create(ViewChallengeModal, challenge).present();
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
                "start_time": moment().unix().valueOf(),
                "id": challenge.$key,
                "host": this._userService.user.auth.displayName,
                "pending_participants": participants,
                "participants": formattedParticipants
            });
    }


    updateChallengeProgress() {
        this.challenges.forEach((challenge => {
            if (challenge.getActiveStatus()) {
            challenge.updateChallengeProgress(this._healthkitService, this._userService.user.uid)
                .then(result => {
                    console.log(result.data);
                    this.af.database.object(result.url).update(result.data);
                    if (result.addXP) {
                        this.af.database.object('users/' + this._userService.user.uid + '/leveldata')
                            .update({
                                current_experience: challenge.getChallengeXP(),
                                complete_date: moment().unix().valueOf()
                            });
                    }
                })
                .catch(err => console.log(err));
            }
        }));
    }
}
        //
        //
        // this.getChallengeList().take(1)
        //     .subscribe(allChallenges => {
        //         this.getActiveChallenges().take(1)
        //             .map(listOfChallenges => {
        //                 let challenges = [];
        //
        //                 if (!listOfChallenges) {
        //                     return [];
        //                 }
        //
        //                 listOfChallenges.forEach(activeChallenge => {
        //                     if (!activeChallenge.pending_participants || activeChallenge.pending_participants
        //                             .indexOf(uid) == -1) {
        //                         let isPresent = activeChallenge.participants.filter(participant => {
        //                             console.log('before filter');
        //                             return participant.id === this._userService.user.auth.uid;
        //                         }).length;
        //
        //                         if (isPresent) {
        //                             let matchingChallenge = allChallenges.find(challenge => {
        //                                 return challenge.$key === activeChallenge.id
        //                             });
        //                             activeChallenge.type = matchingChallenge.type;
        //                             challenges.push(activeChallenge);
        //                         }
        //                     }
        //                 });
        //                 return challenges;
        //             })
        //             .subscribe(listOfChallenges => {
        //                 console.log('subscribe');
        //                 listOfChallenges.forEach(userChallenge => {
        //
        //                     //IF challenge is active and of type STEPS
        //                     if (userChallenge.active && userChallenge.start_time) {
        //                         let participant = userChallenge.participants.find(participant => participant.id === uid);
        //                         let index = userChallenge.participants.findIndex(participant => participant.id === uid);
        //
        //                         //If the user has previously completed it then return;
        //                         if (participant.complete) {
        //                             return;
        //                         }
        //
        //                         this._healthkitService
        //                             .getChallengeMetrics(userChallenge.type, moment.utc(userChallenge.start_time).toDate())//ToDo replace with start time
        //                             .then(metricValue => {
        //                                 console.log('getChallengeSteps', metricValue);
        //
        //                                 let isComplete = metricValue >= userChallenge.completion;
        //
        //                                 this.af.database.object('/active_challenges/' +
        //                                     userChallenge.$key + '/participants/' + index)
        //                                     .update({
        //                                         progress: metricValue,
        //                                         complete: isComplete
        //                                     });
        //
        //                                 if (isComplete) {
        //                                     this._levelService.getLevelData(uid).take(1)
        //                                         .subscribe(levelData => {
        //                                             levelData.update({
        //                                                 current_experience: levelData.current_experience += userChallenge.xp
        //                                             })
        //                                         });
        //                                 }
        //                             }).catch( err => console.log(err));
        //                     }
        //                 });
        //             })
        //
        //     });


