import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {SettingsModal} from "../../../modals/settings/settings";
import {ChallengeService} from "../../../providers/challenge-service";
import {UserService} from "../../../providers/user-service";

@Component({
    selector: 'page-compete-invite',
    templateUrl: 'invite.html'
})
export class CompeteInvitePage implements OnInit {

    public challengeList = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _userService: UserService) {

        this.challengeList = this.navParams.data.pending;
    }

    ionViewDidLoad() {
    }

    ngOnInit() {
        this._challengeService.getChallengeList()
            .subscribe(allChallenges => {
                this._challengeService.getActiveChallenges()
                    .map(listOfChallenges => {
                        let challenges = [];

                        if (!listOfChallenges) {
                            return [];
                        }

                        listOfChallenges.forEach(activeChallenge => {
                            if (activeChallenge.pending_participants && activeChallenge.pending_participants
                                    .indexOf(this._userService.user.auth.uid) !== -1) {

                                let matchingChallenge = allChallenges.find(challenge => {

                                    return challenge.$key === activeChallenge.id
                                });
                                if(matchingChallenge) {
                                    matchingChallenge.key = activeChallenge.$key;
                                    challenges.push(Object.assign(activeChallenge, matchingChallenge));
                                }
                            }
                        });

                        return challenges;
                    })
                    .subscribe(newList => {this.challengeList = newList; console.log(this.challengeList)});
            });
    }

    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }

    acceptChallenge( challenge ){
        this._challengeService.acceptChallenge(challenge)
            .then( () => {
                //nofin mate....
            });
    }
    rejectChallenge( challenge ){

    }
}
