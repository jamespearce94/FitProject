import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {FriendsService} from "../../providers/friends-service";

/*
  Generated class for the FriendRequests page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-friend-requests',
  templateUrl: 'friend-requests.html'
})
export class FriendRequestsPage implements OnInit{

    requestsList:any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private _friendService: FriendsService) {}

  ionViewDidLoad() {
  }

  ngOnInit(){
    let loader = this.loadingCtrl
        .create({
          content: "Retrieving Friends...",
        });

    loader.present();

    this._friendService.getRequestLists()
        .subscribe((requests: any) => {
          this.requestsList = requests
          loader.dismiss();
        });
  }

}
