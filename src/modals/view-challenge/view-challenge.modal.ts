import {Component, OnInit} from '@angular/core';
import {ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import {ChallengeService} from "../../providers/challenge-service";

@Component({
    selector: 'view-challenge-modal',
    templateUrl: 'view-challenge.modal.html'
})
export class ViewChallengeModal implements OnInit {

    challenge = null;
    loading = true;

    constructor(private viewCtrl: ViewController,
                private _userService : UserService) {
        this.challenge = this.viewCtrl.data;
    }

    ngOnInit()
    {
        this._userService.getUserList()
            .subscribe( users => {
                this.challenge.participants.forEach( participant => {
                    participant.percentage = Math.round((participant.progress / this.challenge.completion.required)*100);

                    let user = users.find( user => user.$key === participant.id );

                    Object.assign(participant, user);
                });

                this.loading = false;
            });

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
