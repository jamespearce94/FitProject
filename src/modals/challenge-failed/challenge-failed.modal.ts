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
                    if (participant.progress) {
                        participant.percentage = Math.round((participant.progress / this.challenge.completion) * 100);
                    } else {
                        participant.percentage = 0;
                    }

                    participant.percentage = participant.percentage <= 100 ? participant.percentage : 100;
                    if (participant.complete_date) {
                        participant.complete_date = moment.duration(moment(participant.complete_date).diff(moment(this.challenge.start_time))).humanize();
                    }
                    let user = users.find(user => user.$key === participant.id);
                    Object.assign(participant, user);
                });

                this.loading = false;
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}