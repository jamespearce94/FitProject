import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {ChallengeService} from "../../providers/challenge-service";
import {ChallengeListPage} from "../challenge-list/challenge-list";
import {EventService} from "../../providers/event.service";

@Component({
    selector: 'page-compete',
    templateUrl: 'compete.html'
})
export class CompetePage {

    constructor(public navCtrl: NavController,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _eventService: EventService) {
        // initialise challenge progress on first run
        this._eventService.activeChallengesReadyAnnounced
            .subscribe(() => {
                try {
                    this._challengeService.updateChallengeProgress();
                } catch (err) {
                    console.error(err);
                }
            });
    }

    searchChallenges() {
        this.navCtrl.parent.parent.push(ChallengeListPage);
    }

    doRefresh(refresher){
        // update challenge progress
        this._eventService.announceActiveChallenges();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
}
