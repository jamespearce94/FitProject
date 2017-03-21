import {Component, OnInit} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {StatsService} from "../../providers/stats-service";
import {SettingsModal} from "../../modals/settings/settings";
import {LevelService} from "../../providers/level-service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public stats: any = {};
    public level: any = {};
    public progress: any = {
        max_progress : 100,
        current : 0,
        percentage : 0
    };

    constructor(private navCtrl: NavController,
                private _userService: UserService,
                private _statsService: StatsService,
                private modalCtrl: ModalController,
                private _levelService: LevelService) {


    }

    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this._statsService.getHealthKitSteps();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
    }
}