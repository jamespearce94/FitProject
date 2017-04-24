import {Component, OnInit} from '@angular/core';
import {ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import * as moment from "moment";

@Component({
    selector: 'challenge-failed-modal',
    templateUrl: 'challenge-failed.modal.html'
})
export class ChallengeFailedModal implements OnInit {

    challenge = null;
    loading = true;

    constructor(private viewCtrl: ViewController,
                private _userService: UserService) {
        this.challenge = this.viewCtrl.data;
    }

    ngOnInit() {
        this._userService.getUserList()
            .subscribe(users => {
                this.challenge.participants.forEach(participant => {
                    participant.percentage = Math.round((participant.progress / this.challenge.completion) * 100);
                    // return 100 if percentage is greater than 100
                    participant.percentage = participant.percentage <= 100 ? participant.percentage : 100;

                    let user = users.find(user => user.$key === participant.id);
                    //combine user and participant for extra data
                    Object.assign(participant, user);
                });

                this.loading = false;
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}