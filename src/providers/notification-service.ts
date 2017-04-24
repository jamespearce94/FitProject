import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {LocalNotifications} from "@ionic-native/local-notifications";

@Injectable()
export class NotificationService {

  constructor(public http: Http, private localNotifications: LocalNotifications) {

  }

  sendNotification(delaySeconds: number, message : string, startTime: number){
    // Schedule notification half way through challenge
    this.localNotifications.schedule({
      text: message,
      sound: null,
        at: new Date(new Date((startTime * 1000 + delaySeconds * 1000) - (delaySeconds/2 * 1000)))
    });

  }
}
