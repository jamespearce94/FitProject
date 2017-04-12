import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Health} from "ionic-native";
import {ChallengeType} from "../Classes/ChallengeType";

@Injectable()
export class HealthKitService {

    constructor(public http: Http) { }

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
            'startDate': new Date(startDate * 1000),
            'endDate': new Date(),
            'dataType': '',
            'bucket': 'day',
        };

        switch (metricType) {
            case ChallengeType.STEPS: {
                queryObj.dataType = 'steps';
                break;
            }
            case ChallengeType.CALORIES: {
                queryObj.dataType = 'calories.active';
                break;
            }
            case ChallengeType.DISTANCE: {
                queryObj.dataType = 'distance';
                break;
            }
        }

        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b))
            // .catch( err => Math.floor(Math.random() * 20) * 1000);
    }

    // getSignupDate(signupDate: Date) {
    //     signupDate.setHours(0);
    //     signupDate.setMinutes(0);
    //     let queryObj = {
    //         'startDate': signupDate,
    //         'endDate': new Date(),
    //         'dataType': 'steps',
    //         'bucket': 'day',
    //     };
    //
    //     return Health.queryAggregated(queryObj)
    //         .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));
    // }

    getLifetimeDistance(startDate: number): Promise <any> {
        let queryObj = {
            'startDate': new Date(startDate * 1000),
            'endDate': new Date(),
            'dataType': 'distance',
            'bucket': 'day',
        };

        return Health.queryAggregated(queryObj)
            .then((result: any) => result.map(day => day.value).reduce((a, b) => a + b));
    }
}