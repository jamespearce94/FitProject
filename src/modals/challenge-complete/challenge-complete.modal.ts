import {Component, OnInit} from '@angular/core';
import {ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import * as moment from "moment";

@Component({
    selector: 'challenge-complete-modal',
    templateUrl: 'challenge-complete.modal.html'
})
export class ChallengeCompleteModal implements OnInit {

    challenge = null;
    loading = true;
    showStats = false;

    constructor(private viewCtrl: ViewController,
                private _userService: UserService) {
        this.challenge = this.viewCtrl.data.challenge;
        this.showStats = this.viewCtrl.data.showStats;
    }

    ngOnInit() {
        //ToDo fix shite code
        this._userService.getUserList()
            .subscribe( users => {
                this.challenge.participants.forEach( participant => {
                    participant.percentage = Math.round((participant.progress / this.challenge.completion.required)*100);
                    participant.percentage = participant.percentage >= 100 ? 100 : participant.percentage;

                    let user = users.find( user => user.$key === participant.uid );

                    Object.assign(participant, user);
                });

                this.loading = false;
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
