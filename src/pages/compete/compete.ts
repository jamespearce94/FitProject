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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController,
                private _challengeService: ChallengeService,
                private _userService: UserService) {

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
