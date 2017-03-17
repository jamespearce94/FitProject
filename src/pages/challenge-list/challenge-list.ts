import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {ChallengeService} from "../../providers/challenge-service";
import {FriendsService} from "../../providers/friends-service";
import {UserService} from "../../providers/user-service";

/*
 Generated class for the ChallengeList page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-challenge-list',
    templateUrl: 'challenge-list.html'
})
export class ChallengeListPage implements OnInit {

    private challenges: Array<any> = [];
    private selectedParticipants: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _challengeService: ChallengeService,
                private _friendService: FriendsService,
                private _userService: UserService,
                public alertCtrl: AlertController,
                private loadingCtrl : LoadingController) {
    }

    ionViewDidLoad() {
    }

    ngOnInit() {
        this._challengeService.getChallengeList()
            .subscribe((challengeList) => this.challenges = challengeList)
    }

    challengeAlert(challenge: any) {
        this._friendService.getFriends()
            .first()
            .toPromise()
            .then((friends) => {
                let alert = this.alertCtrl.create();

                alert.setTitle('Invite friends to ' + challenge.challenge_name);
                friends.forEach((friend) => {
                    alert.addInput({
                        type: 'checkbox',
                        label: friend.name,
                        value: friend.$key
                    });
                });

                alert.addButton({
                    text: 'Challenge Friends',
                    handler: data => {
                        this.selectedParticipants = data;
                        this.selectedParticipants.push(this._userService.user.uid);
                        this._challengeService.createChallenge(this.selectedParticipants, challenge);
                    }
                });
                alert.addButton('Cancel');
                alert.present();
            });
    }

}
