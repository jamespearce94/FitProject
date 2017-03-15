import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {SettingsModal} from "../../modals/settings/settings";
import {ChallengeService} from "../../providers/challenge-service";
import {ChallengeListPage} from "../challenge-list/challenge-list";
import {UserService} from "../../providers/user-service";
import {ViewChallengeModal} from "../../modals/view-challenge/view-challenge.modal";

/*
 Generated class for the Compete page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-compete',
    templateUrl: 'compete.html'
})
export class CompetePage implements OnInit {

    public challengeList = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _userService: UserService) {

        this._challengeService.getChallengeList()
            .subscribe(allChallenges => {
                this._challengeService.getActiveChallenges()
                    .map(listOfChallenges => {
                        let challenges = [];

                        if (!listOfChallenges) {
                            return [];
                        }

                        listOfChallenges.forEach(activeChallenge => {
                            if (!activeChallenge.pending_participants || activeChallenge.pending_participants
                                    .indexOf(this._userService.user.auth.uid) == -1) {
                                let isPresent = activeChallenge.participants.filter(participant => {
                                    return participant.id === this._userService.user.auth.uid;
                                }).length;

                                if (isPresent) {
                                    let matchingChallenge = allChallenges.find(challenge => {
                                        return challenge.$key === activeChallenge.id
                                    });
                                    // debugger;
                                    // if (isPresent.progress < matchingChallenge.completion) {//WTF is this logic mate?
                                        challenges.push(Object.assign(activeChallenge, matchingChallenge));
                                    // }


                                }
                            }
                        });
                        return challenges;
                    })
                    .subscribe(listOfChallenges => {
                        console.log(listOfChallenges);
                        this.challengeList = listOfChallenges
                    });
            });
    }

    ionViewDidLoad() {
    }

    ngOnInit() {

    }

    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }

    searchChallenges() {
        this.navCtrl.parent.parent.push(ChallengeListPage);
    }
}
