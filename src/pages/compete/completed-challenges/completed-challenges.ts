import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {UserService} from "../../../providers/user-service";
import {ChallengeService} from "../../../providers/challenge-service";
import {ChallengeListPage} from "../../challenge-list/challenge-list";
import {SettingsModal} from "../../../modals/settings/settings";
import {EventService} from "../../../providers/event.service";
import * as moment from "moment";

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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _userService: UserService,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _eventService: EventService) {
    }

    ngOnInit() {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CompletedChallengesPage');
    }
    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }

    searchChallenges() {
        this.navCtrl.parent.parent.push(ChallengeListPage);
    }
    getCurrentTime(){
        return moment().unix();
    }
    doRefresh(refresher){
        this._eventService.announceActiveChallenges();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
}
