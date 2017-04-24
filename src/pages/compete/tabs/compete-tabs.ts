import {Component, OnInit} from '@angular/core';
import {CompetePage} from "../compete";
import {CompeteInvitePage} from "../invite/invite";
import {ChallengeService} from "../../../providers/challenge-service";
import {UserService} from "../../../providers/user-service";
import {CompletedChallengesPage} from "../completed-challenges/completed-challenges";

@Component({
    templateUrl: 'compete-tabs.html'
})
export class CompeteTabsPage implements OnInit {

    tab1Root: any = CompetePage;
    tab2Root: any = CompletedChallengesPage;
    tab3Root: any = CompeteInvitePage;

    params = {
        pending: [],
        active: []
    };

    constructor(private _challengeService: ChallengeService,
                private _userService: UserService) {
    }

    ngOnInit() {
        // to display number of pending challenges on the tab icon
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

                                challenges.push(Object.assign(activeChallenge, matchingChallenge));
                            }
                        });

                        return challenges;
                    })
                    .subscribe(newList => this.params.pending = newList);
            });
    }
}
