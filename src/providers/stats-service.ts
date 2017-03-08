import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AngularFire} from "angularfire2";
import {Observable} from "rxjs";
import {DateService} from "./date-service";

@Injectable()
export class StatsService {

    constructor(public http: Http,
                private af: AngularFire,
                private _dateService: DateService) {
    }

    getStats(uid: string): Observable<any> {
        return this.af.database.object('/users/' + uid + '/fitness_stats')
            .map( result => { //map and attach uid so we can use it later in subscribe...
                result.uid = uid;
                return result;
            });
    }

    updateCurrentSteps(uid: string,steps: number){
        this.af.database.object('users/' + uid + '/fitness_stats')
            .update({current_steps: steps,
            last_update: this._dateService.getFormattedDate()});
    }

}