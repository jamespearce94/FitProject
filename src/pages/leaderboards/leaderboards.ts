import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {SettingsModal} from "../../modals/settings/settings";

@Component({
    selector: 'page-leaderboards',
    templateUrl: 'leaderboards.html'
})
export class LeaderboardsPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
    }

    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }
}
