import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {UserService} from "../../../providers/user-service";
import {ChallengeService} from "../../../providers/challenge-service";
import {ChallengeListPage} from "../../challenge-list/challenge-list";
import {EventService} from "../../../providers/event.service";
import * as moment from "moment";

@Component({
    selector: 'page-completed-challenges',
    templateUrl: 'completed-challenges.html'
})
export class CompletedChallengesPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _userService: UserService,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _eventService: EventService) {
    }

    searchChallenges() {
        this.navCtrl.parent.parent.push(ChallengeListPage);
    }
    getCurrentTime(){
        return moment().unix();
    }
    doRefresh(refresher){
        // update challenge progress
        this._eventService.announceActiveChallenges();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
}
