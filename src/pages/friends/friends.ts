import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {FriendsService} from "../../providers/friends-service";
import {StatsService} from "../../providers/stats-service";
import {SettingsModal} from "../../modals/settings/settings";
import {UserSearchPage} from "../user-search/user-search";
import {LevelService} from "../../providers/level-service";

@Component({
    selector: 'page-friends',
    templateUrl: 'friends.html'
})
export class FriendsPage implements OnInit {

    private friends: any = [];

    constructor(private _friendService: FriendsService,
                private _statsService: StatsService,
                private  _levelService: LevelService,
                private loadingCtrl: LoadingController,
                private modalCtrl : ModalController,
                private navCtrl : NavController) {
    }

    ionViewDidLoad() {

    }

    ngOnInit(): any {
        let loader = this.loadingCtrl
            .create({
                content: "Retrieving Friends...",
            });

        loader.present();

        this._friendService.getFriends()
            .subscribe((friends: any) => {

                friends.forEach((friend) => {
                    this._statsService.getStats(friend.$key)
                        .take(1)
                        .subscribe((friendStats) => {
                            this._levelService.getLevelData(friend.$key)
                                .take(1)
                                .subscribe((levelStats) => {
                                    let myFriend = this.friends.find(friend => friend.$key === friendStats.uid);
                                    myFriend.levelData = levelStats;
                                    myFriend.stats = friendStats;
                                });
                        })

                });

                this.friends = friends;
                loader.dismiss();
            });


    }

    searchUsers(){
        this.navCtrl.parent.parent.push(UserSearchPage);
    }


    presentModal() {
        let modal = this.modalCtrl.create(SettingsModal);
        modal.present();
    }
}