import {Component, OnInit} from '@angular/core';
import {ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import {ChallengeService} from "../../providers/challenge-service";
import * as moment from "moment";

@Component({
    selector: 'challenge-complete-modal',
    templateUrl: 'challenge-complete.modal.html'
})
export class ChallengeCompleteModal implements OnInit {

    challenge = null;
    currentUser : any = {};
    loading = true;

    constructor(private viewCtrl: ViewController,
                private _userService : UserService) {
        this.challenge = this.viewCtrl.data;
        this.currentUser = _userService.user;
    }

    ngOnInit()
    {
        this._userService.getUserList()
            .subscribe( users => {
                this.challenge.participants.forEach( participant => {
                    if( participant.progress )
                    {
                        participant.percentage = Math.round((participant.progress / this.challenge.completion)*100);
                    }else {
                        participant.percentage = 0;
                    }

                    participant.percentage = participant.percentage <= 100 ? participant.percentage : 100;

                    let user = users.find( user => user.$key === participant.id);
                    Object.assign(participant, user);
                });
                this.currentUser = this.challenge.participants.find(participant => participant.id === this._userService.user.uid);

                this.currentUser.complete_date = moment.duration(moment(this.currentUser.complete_date).diff(moment(this.challenge.start_time))).humanize();

                this.loading = false;
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
