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
import {LevelService} from "./level-service";
import {ChallengeCompleteModal} from "../modals/challenge-complete/challenge-complete.modal";
import {EventService} from "./event.service";

@Injectable()
export class ChallengeService {

    public challenges: Array<IChallenge> = [];
    private firstLoad = true;

    constructor(public http: Http,
                private af: AngularFire,
                private modalCtrl: ModalController,
                private _userService: UserService,
                private _healthkitService: HealthKitService,
                private _levelService: LevelService,
                private _eventService: EventService) {

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
                                default: {

                                }
                            }
                        });

                        if( this.firstLoad ){
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

    rejectChallenge(challenge) {

    }

    viewChallenge(challenge): void {
        this.modalCtrl.create(ViewChallengeModal, challenge).present();
    }

    completeChallengesPopup(challenge): void {
        this.modalCtrl.create(ChallengeCompleteModal, challenge).present();

    }

    createChallenge(participants: Array<any>, challenge: any) {
        let formattedParticipants = participants
            .map(participant => {
                return {
                    "id": participant,
                    "progress": 0,
                    "complete_time": null,
                    "last_update": null
                }
            });
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
                challenge.updateChallengeProgress(this._healthkitService, this._userService.user.uid)
                    .then(result => {
                        console.log(result);
                        this.af.database.object(result.url).update(result.data);
                        if (result.addXP) {
                            this._levelService.addXP(challenge);
                            this.completeChallengesPopup(challenge);
                        }
                    })
                    .catch(err => console.log(err));
            }
        }));
    }
}