import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {LocalNotifications} from "@ionic-native/local-notifications";

/*
  Generated class for the NotificationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationService {

  constructor(public http: Http, private localNotifications: LocalNotifications) {

  }

  sendNotification(delaySeconds: number, message : string, startTime: number){
    this.localNotifications.schedule({
      text: message,
      sound: null,
        at: new Date(new Date((startTime * 1000 + delaySeconds * 1000) - (delaySeconds/2 * 1000)))
    });

  }
}
