import {Component, OnInit} from '@angular/core';
import {ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import {ChallengeService} from "../../providers/challenge-service";

@Component({
    selector: 'multistep-challenges-modal',
    templateUrl: 'multistep-challenges.modal.html'
})
export class MultiStepChallengeModal implements OnInit {

    challenge = null;
    loading = true;
    leader: any = null;

    constructor(private viewCtrl: ViewController,
                private _userService: UserService) {
        this.challenge = this.viewCtrl.data;
    }

    ngOnInit() {
        this._userService.getUserList()
            .subscribe(users => {
                this.challenge.participants.forEach(participant => {
                    participant.step1.percentage = Math.round((participant.step1.progress / this.challenge.completion.step1) * 100);
                    participant.step2.percentage = Math.round((participant.step2.progress / this.challenge.completion.step2) * 100);


                    let user = users.find(user => user.$key === participant.uid);
                    Object.assign(participant, user);
                });
                this.loading = false;
            });
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}

