import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {FriendsService} from "../../providers/friends-service";
import {UserService} from "../../providers/user-service";

/*
 Generated class for the UserSearch page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-user-search',
    templateUrl: 'user-search.html'
})
export class UserSearchPage implements OnInit {

    private usersList: any = [];
    public searchTerm: string = "";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private _friendService: FriendsService,
                private _userService: UserService) {
    }

    ionViewDidLoad() {
    }

    ngOnInit() {
        let loader = this.loadingCtrl
            .create({
                content: "Retrieving Users...",
            });

        loader.present();

        this._userService.getUserList()
            .subscribe((users: any) => {
                this._friendService.getFriends()
                    .subscribe((friends: any) => {

                        this.usersList = users.filter( user => {
                            return user.$key !== this._userService.user.auth.uid
                                && friends.find(( friend ) => {
                                return user.$key === friend.$key
                            }) === undefined;
                        } );

                        loader.dismiss();
                    });
            });
    }
}