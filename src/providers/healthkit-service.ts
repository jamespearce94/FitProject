import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Health} from "ionic-native";
import {AngularFire} from "angularfire2";

@Injectable()
export class HealthKitService {

    constructor(public http: Http, private af: AngularFire) {
    }

    getDaySteps(): Promise<any> {
        let endDate = new Date();
        endDate.setHours(0);
        endDate.setMinutes(0);

        let queryObj = {
            'startDate': endDate,
            'endDate': new Date(),
            'dataType': 'steps',
            'bucket': 'day',
        };

        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));
    }

    getChallengeSteps(): Promise<any> {
        let last_update = new Date();
        let queryObj = {
            'startDate': last_update,
            'endDate': new Date(),
            'dataType': 'steps',
            'bucket': 'day',
        };

        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));
    }

    getChallengeCalories(): Promise<any> {
        let last_update = new Date();
        let queryObj = {
            'startDate': last_update,
            'endDate': new Date(),
            'dataType': 'calories',
            'bucket': 'day',
        };
        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));
    }

    getSignupDate(signupDate: Date) {
        signupDate.setHours(0);
        signupDate.setMinutes(0);
        let queryObj = {
            'startDate': signupDate,
            'endDate': new Date(),
            'dataType': 'steps',
            'bucket': 'day',
        };

        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));
    }

    getLifetimeSteps(date: Date): Promise <any>{
        date.setHours(0,0,0);
                let queryObj = {
                    'startDate': new Date(date),
                    'endDate': new Date(),
                    'dataType': 'steps',
                    'bucket': 'day',
                };

                return Health.queryAggregated(queryObj)
                    .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));


    }

}
