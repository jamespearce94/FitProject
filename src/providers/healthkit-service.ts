import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Health} from "ionic-native";
import {AngularFire} from "angularfire2";
import {ChallengeType} from "../Classes/ChallengeType";

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

    /**
     *
     * @param metricType
     * @param startDate
     * @return {Promise<any>}
     */
    getChallengeMetrics(metricType: any, startDate: number): Promise<any> {
        let queryObj = {
            'startDate': new Date(startDate),
            'endDate': new Date(),
            'dataType': '',
            'bucket': 'day',
        };

        switch (metricType) {
            case ChallengeType.STEPS:{
                queryObj.dataType = 'steps';
                break;
            }
            case ChallengeType.CALORIES:{
                queryObj.dataType = 'calories.active';
                break;
            }
        }

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

    getLifetimeSteps(date: Date): Promise <any> {
        date.setHours(0, 0, 0);
        let queryObj = {
            'startDate': date,
            'endDate': new Date(),
            'dataType': 'steps',
            'bucket': 'day',
        };

        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));


    }

}
