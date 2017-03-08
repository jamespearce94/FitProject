import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Health} from "ionic-native";
import {AngularFire} from "angularfire2";

@Injectable()
export class HealthKitService {

    constructor(public http: Http, private af: AngularFire) {
    }

    getSteps() : Promise<any> {
        let endDate = new Date();

        endDate.setDate(endDate.getDate() - 1);

        let queryObj = {
            'startDate': new Date(),
            'endDate': endDate,
            'dataType': 'steps',
            'bucket': 'day',
        };

        return Health.queryAggregated(queryObj);
    }

}
