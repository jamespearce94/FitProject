import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../../providers/user-service";
import {ChallengeService} from "../../../providers/challenge-service";

/*
 Generated class for the CompletedChallenges page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-completed-challenges',
    templateUrl: 'completed-challenges.html'
})
export class CompletedChallengesPage implements OnInit {
    completedChallenges = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _userService: UserService,
                private _challengeService: ChallengeService) {
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
                            if (!activeChallenge.pending_participants || activeChallenge.pending_participants
                                    .indexOf(this._userService.user.auth.uid) == -1) {
                                let userFound = activeChallenge.participants.find(participant => {
                                    return participant.id === this._userService.user.auth.uid;
                                });

                                if (userFound) {
                                    let matchingChallenge = allChallenges.find(challenge => {
                                        return challenge.$key === activeChallenge.id
                                    });

                                    if (userFound.progress >= matchingChallenge.completion) {
                                        challenges.push(Object.assign(activeChallenge, matchingChallenge));
                                    }
                                }
                            }
                        });

                        return challenges;
                    })
                    .subscribe(listOfChallenges => {
                        this.completedChallenges = listOfChallenges
                    });
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CompletedChallengesPage');
    }
}
