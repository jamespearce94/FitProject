import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AngularFire} from "angularfire2";
import {Observable} from "rxjs";
import * as moment from "moment";
import {UserService} from "./user-service";
import {LoadingController} from "ionic-angular";
import {HealthKitService} from "./healthkit-service";

@Injectable()
export class StatsService {

    public stats: any = {};

    constructor(public http: Http,
                private af: AngularFire,
                private _userService: UserService,
                private loadingCtrl: LoadingController,
                private _healthKitService : HealthKitService) {
        let loader = this.loadingCtrl
            .create({
                content: "Retrieving Profile..."
            });
        loader.present();
        this.getHealthKitSteps();
        this.getStats(_userService.user.uid)
            .take(1)
            .subscribe(userStats => {
                this.stats = userStats;
                console.log(this.stats);
                loader.dismiss()
                    .catch(err => console.warn("loader.dismiss()"));
            })

    }

    getStats(uid: string): Observable<any> {
        return this.af.database.object('/users/' + uid + '/fitness_stats')
            .map(result => { //map and attach uid so we can use it later in subscribe...
                result.uid = uid;
                return result;
            });
    }

    updateCurrentSteps(uid: string, steps: number) {
        console.log('steps', steps);
        this.af.database.object('users/' + uid + '/fitness_stats')
            .update({current_steps: steps});
    }

    updateLifetimeSteps(uid: string, steps: number) {
        console.log('steps', steps);
        this.af.database.object('users/' + uid + '/fitness_stats')
            .update({lifetime_steps: steps});
    }

    updateDate(uid: string) {
        this.af.database.object('users/' + uid + '/fitness_stats')
            .update({last_update: moment().unix()});
    }

    getHealthKitSteps(){
        console.log("Updating HealthKit");
        this._healthKitService.getDaySteps()
            .then((result) => {
                this.updateCurrentSteps(this._userService.user.uid, result);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}