import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {UserService} from "./user-service";
import {HealthKitService} from "./healthkit-service";
import * as moment from "moment";
import {ViewChallengeModal} from "../modals/view-challenge/view-challenge.modal";
import {ModalController} from "ionic-angular";
import {ChallengeType} from "../Classes/ChallengeType";
import {IChallenge} from "../Classes/IChallenge";
import {StepsChallenge} from "../Classes/StepChallenge";
import {CaloriesChallenge} from "../Classes/CaloriesChallenge";
import {DistanceChallenge} from "../Classes/DistanceChallenge";
import {LevelService} from "./level-service";
import {ChallengeCompleteModal} from "../modals/challenge-complete/challenge-complete.modal";
import {EventService} from "./event.service";
import {BaseChallenge} from "../Classes/BaseChallenge";
import {NotificationService} from "./notification-service";
import {ChallengeFailedModal} from "../modals/challenge-failed/challenge-failed.modal";
import {MultiStepChallenge} from "../Classes/MultiStepChallenge";
import {MultiStepChallengeModal} from "../modals/multistep-challenges/multistep-challenges.modal";

@Injectable()
export class ChallengeService {

    public challenges: Array<BaseChallenge> = [];
    private firstLoad = true;

    constructor(public http: Http,
                private af: AngularFire,
                private modalCtrl: ModalController,
                private _userService: UserService,
                private _healthkitService: HealthKitService,
                private _levelService: LevelService,
                private _eventService: EventService,
                private _notificationsService: NotificationService) {

        // get active challenges and list of challenges
        this.getChallengeList()
            .take(1)
            .subscribe
            (allChallenges => {
                this.getActiveChallenges()
                    .map(listOfChallenges => {
                        let challenges = [];

                        if (!listOfChallenges) {
                            return [];
                        }
                        // check if user is in the active challenge
                        listOfChallenges.forEach(activeChallenge => {
                            if (!activeChallenge.pending_participants || activeChallenge.pending_participants
                                    .indexOf(this._userService.user.uid) == -1) {
                                let isPresent = activeChallenge.participants.filter(participant => {
                                    return participant.uid === this._userService.user.auth.uid;
                                }).length;
                                // if matched combine active and list challenge together
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
                        //Initialise challenges by type
                        list.forEach((challenge, index) => {
                            switch (challenge.type) {
                                case ChallengeType.STEPS: {
                                    this.challenges.splice(index, 1, new StepsChallenge(challenge,
                                        ChallengeType.STEPS, this._userService.user.uid));
                                    break;
                                }
                                case ChallengeType.CALORIES: {
                                    this.challenges.splice(index, 1, new CaloriesChallenge(challenge,
                                        ChallengeType.CALORIES, this._userService.user.uid));
                                    break;
                                }
                                case ChallengeType.DISTANCE: {
                                    this.challenges.splice(index, 1, new DistanceChallenge(challenge,
                                        ChallengeType.DISTANCE, this._userService.user.uid));
                                    break;
                                }
                                case ChallengeType.MULTI: {
                                    this.challenges.splice(index, 1, new MultiStepChallenge(challenge,
                                        ChallengeType.MULTI, this._userService.user.uid));
                                    break;
                                }
                                default: {

                                }
                            }
                        });
                        //update progress for challenges
                        if (this.firstLoad) {
                            _eventService.announceActiveChallenges();
                            this.firstLoad = false;
                        }
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
                start_time: challenge.pending_participants.length ? moment().unix() : null
            });
    }

    rejectChallenge(challenge, uid) {
        if (challenge.pending_participants.length == 1) {
            //delete challenge if last participant rejects
            this.af.database.object('active_challenges/' + challenge.key)
                .remove()
        }
        else {
            let pending = challenge.pending_participants;
            let participants = challenge.participants;
            //remove pending participants
            let pendingIndex = pending.findIndex((participant) => {
                return participant == uid
            });
            let participant = participants.find(participant => {
                return participant.uid == uid;
            });

            let index = challenge.participants.findIndex(user => {
                return user.id == participant.id
            });

            if (pendingIndex > -1) {
                challenge.pending_participants.splice(pendingIndex, 1);
            }
            if (index > -1) {
                challenge.participants.splice(index, 1);
            }


            this.af.database.object('active_challenges/' + challenge.key)
                .update({
                    pending_participants: challenge.pending_participants,
                    participants : challenge.participants
                })
        }
    }

    viewChallenge(challenge): void {
        if (challenge.type != 'MultiStep') {
            this.modalCtrl.create(ViewChallengeModal, challenge).present();
        }
        else {
            this.modalCtrl.create(MultiStepChallengeModal, challenge).present();
        }
    }

    completeChallengesPopup(challenge, showStats): void {
        this.modalCtrl.create(ChallengeCompleteModal, {challenge: challenge, showStats: showStats}).present();

    }

    failedChallengesPopup(challenge): void {
        this.modalCtrl.create(ChallengeFailedModal, challenge).present();

    }

    createChallenge(participants: Array<any>, challenge: any) {
        let formattedParticipants;

        if (challenge.type == 'MultiStep') {
            formattedParticipants = participants
                .map(participant => {
                    let index = participants.findIndex((user) => {
                        return user === participant
                    });

                    return {
                        "id": index,
                        "uid": participant,
                        "step1": {
                            "progress": 0,
                            "complete": false
                        },
                        "step2": {
                            "progress": 0,
                            "complete": false
                        },
                        "complete_time": null,
                        "last_update": null,
                        "notification": false
                    }
                });
        }
        else {
            formattedParticipants = participants
                .map(participant => {
                    let index = participants.findIndex((user) => {
                        return user === participant
                    });

                    return {
                        "id": index,
                        "uid": participant,
                        "progress": 0,
                        "complete_time": null,
                        "last_update": null,
                        "notification": false
                    }
                });
        }

        this.af.database.list('/active_challenges')
            .push({
                "active": false,
                "start_time": moment().unix(),
                "id": challenge.$key,
                "host": this._userService.user.auth.displayName,
                "pending_participants": participants.filter(participant => participant != this._userService.user.uid),
                "participants": formattedParticipants
            });
    }

    updateChallengeProgress() {
        this.challenges.forEach((challenge => {
            if (challenge.getActiveStatus()) {
                challenge.updateChallengeProgress(this._healthkitService, this._notificationsService, this._userService.user.uid)
                    .then(result => {
                        // callback function updates Firebase
                        if (result.data.failed) {
                            //first time failed
                            this.af.database.object(result.url).update(result.data);
                            this.failedChallengesPopup(challenge);
                        }
                        else {
                            this.af.database.object(result.url).update(result.data);
                            if (result.addXP) {
                                this._levelService.addXP(challenge);
                                this.completeChallengesPopup(challenge, false);
                            }
                        }

                    })
                    .catch(err => {
                        console.warn('updateChallengeProgress Error', err);
                    });
            }
        }));
    }
}