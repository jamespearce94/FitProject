import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController, ModalController} from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {StatsService} from "../../providers/stats-service";
import {SettingsModal} from "../../modals/settings/settings";
import {HealthKitService} from "../../providers/healthkit-service";
import {LevelService} from "../../providers/level-service";
import {ChallengeService} from "../../providers/challenge-service";
import {AngularFire} from "angularfire2";
import * as moment from "moment";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

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
                private loadingCtrl: LoadingController,
                private modalCtrl: ModalController,
                private _healthKitService: HealthKitService,
                private _challengeService: ChallengeService,
                private _levelService: LevelService,
                private af : AngularFire) {

        let loader = this.loadingCtrl
            .create({
                content: "Retrieving Profile..."
            });
        loader.present();

        this._statsService.getStats(this._userService.user.uid)
            .subscribe(userStats => {
                this.stats = userStats;
                console.debug(moment(userStats.signup_date)
                    .format("dddd, MMMM Do YYYY, h:mm:ss a"));
                loader.dismiss()
                    .catch( err => console.warn("loader.dismiss()") );
            });

        this._healthKitService.getDaySteps()
            .then((result) => {
                console.log('getDaySteps', result);
                this._statsService.updateCurrentSteps(this._userService.user.uid, result);
            })
            .catch((err) => {
                console.log(err);
            });

        this.updateLifetimeSteps();
        this._challengeService.updateChallengeStepProgress(this._userService.user.uid);
        this._statsService.updateDate(this._userService.user.uid);
    }

    ngOnInit() {
        this._levelService.getLevelData(this._userService.user.uid)
            .subscribe(levelData => {
                this.level = levelData;
                this._levelService.GetLevels()
                    .subscribe((levels) => {
                        levels.forEach((level) => {
                            if (level.level == this.level.level) {
                                this.progress.max_progress = level.exp_required;
                                this.progress.current = this.level.current_experience;
                                this.progress.percentage = this.level.current_experience ?
                                    ( this.level.current_experience / level.exp_required ) * 100 : 0;

                                this.progress.percentage = parseFloat(Number(this.progress.percentage).toFixed(2));
                            }
                        })
                    })
            })
    }

    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }

    loadProgress() {

    }
    updateLifetimeSteps(){
        this._statsService.getStats(this._userService.user.uid).take(1)
            .subscribe(userStats => {
                this._healthKitService.getLifetimeSteps(new Date())
                    .then((result) => {
                        console.log('getLifeSteps', result);
                        this._statsService.updateLifetimeSteps(this._userService.user.uid, result);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    }
}