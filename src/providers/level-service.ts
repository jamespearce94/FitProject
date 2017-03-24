import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {UserService} from "./user-service";
import {ModalController} from "ionic-angular";
import {LevelUpModal} from "../modals/level-up.modal/level-up.modal";

@Injectable()
export class LevelService {

    public level: any = {};

    public definedLevels: any = [];

    public progress: any = {
        max_progress: 100,
        current: 0,
        percentage: 0
    };

    constructor(public http: Http,
                private af: AngularFire,
                private _userService: UserService,
                private modalCtrl: ModalController,) {
        this.getLevelData(_userService.user.uid)
            .subscribe(levelData => {
                this.level = levelData;
                this.GetLevels()
                    .subscribe((levels) => {
                    this.definedLevels = levels;
                        this.updateLevelIfRequired();
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

    getLevelData(uid): FirebaseObjectObservable<any> {
        return this.af.database.object('/users/' + uid + '/leveldata');
    }

    GetLevels(): FirebaseListObservable<any> {
        return this.af.database.list('/Levels/')
    }

    addXP(challenge): void {
        this.af.database.object('users/' + this._userService.user.uid + '/leveldata')
            .update({
                current_experience: this.level.current_experience + challenge.getChallengeXP()
            })

    }

    levelUpModel(level): void {
        this.modalCtrl.create(LevelUpModal, level).present();
    }

    updateLevelIfRequired(): void {
                let currentLevel = this.definedLevels
                    .find(level => this.level.current_experience >= level.exp_min
                    && this.level.current_experience <= level.exp_required);

                if (this.level.level != currentLevel.level) {
                    this.af.database.object('users/' + this._userService.user.uid + '/leveldata')
                        .update({
                            level: currentLevel.level,
                            experience_name: currentLevel.experience_name
                        });
                    this.levelUpModel(currentLevel);
                }


    }

}
