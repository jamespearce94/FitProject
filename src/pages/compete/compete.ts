import {Component, OnInit} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {SettingsModal} from "../../modals/settings/settings";
import {ChallengeService} from "../../providers/challenge-service";
import {ChallengeListPage} from "../challenge-list/challenge-list";
import {EventService} from "../../providers/event.service";

@Component({
    selector: 'page-compete',
    templateUrl: 'compete.html'
})
export class CompetePage implements OnInit {

    constructor(public navCtrl: NavController,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _eventService: EventService) {

        this._eventService.activeChallengesReadyAnnounced
            .subscribe(() => {
                try {
                    this._challengeService.updateChallengeProgress();
                } catch (err) {
                    console.error(err);
                }
            });
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
