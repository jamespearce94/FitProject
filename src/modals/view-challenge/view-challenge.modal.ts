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
    leader: any = null;

    constructor(private viewCtrl: ViewController,
                private _userService : UserService) {
        this.challenge = this.viewCtrl.data;
    }

    ngOnInit()
    {
        this._userService.getUserList()
            .subscribe( users => {
                this.challenge.participants.forEach( participant => {
                    if(participant.progress < 1){
                        participant.percentage = 0;
                    }
                    else{
                        participant.percentage = Math.round((participant.progress / this.challenge.completion.required)*100);
                    }
                    let user = users.find( user => user.$key === participant.id );
                    Object.assign(participant, user);
                    this.challenge.participants.forEach((participant)=>{
                        if (this.leader == null){
                            this.leader = participant;
                        }
                        else{
                            if(participant.complete_date && this.leader.complete_date != null)
                            {
                                if(participant.complete_date < this.leader.complete_date){
                                    this.leader = participant;
                                }
                                if(participant.progress > this.leader.progress)
                                {
                                    this.leader = participant;
                                }
                            }
                            else {
                                if(participant.progress > this.leader.progress)
                                {
                                    this.leader = participant;
                                }
                            }


                        }
                    });
                    if(this.leader != null){
                        this.challenge.participants = this.challenge.participants.filter((participant) => {
                            return participant.id != this.leader.id
                        })
                    }
                });
                this.loading = false;
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
