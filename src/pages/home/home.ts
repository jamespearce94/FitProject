import {Component, OnInit} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {StatsService} from "../../providers/stats-service";
import {LevelService} from "../../providers/level-service";
import {EventService} from "../../providers/event.service";
import {NotificationService} from "../../providers/notification-service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public stats: any = {};
    public level: any = {};
    public progress: any = {
        max_progress: 100,
        current: 0,
        percentage: 0
    };

    constructor(private navCtrl: NavController,
                private _userService: UserService,
                private _statsService: StatsService,
                private modalCtrl: ModalController,
                private _levelService: LevelService,
                private _eventService: EventService,
                private _notifcationsService: NotificationService) {


    }

    doRefresh(refresher) {
        //refresh user daily stats
        this._statsService.getHealthKitSteps();
        this._statsService.getHealthKitLifeDistance();
        this._eventService.announceActiveChallenges();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
}