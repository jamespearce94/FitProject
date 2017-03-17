import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";

@Injectable()
export class LevelService {

  constructor(public http: Http,
              private af: AngularFire,) {
  }

  getLevelData(uid): FirebaseObjectObservable<any>{
    return this.af.database.object('/users/' + uid + '/leveldata');
  }

  GetLevels(): FirebaseListObservable<any>{
    return this.af.database.list('/Levels/')
  }

}
