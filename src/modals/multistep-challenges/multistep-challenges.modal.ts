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
    leader : any = null;

    constructor(private viewCtrl: ViewController,
                private _userService : UserService) {
        this.challenge = this.viewCtrl.data;
    }

    ngOnInit()
    {
        this._userService.getUserList()
            .subscribe( users => {
                this.challenge.participants.forEach( participant => {
                    participant.step1.percentage = Math.round((participant.step1.progress / this.challenge.completion.step1)*100);
                    participant.step2.percentage = Math.round((participant.step2.progress / this.challenge.completion.step2)*100);


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
                                if(participant.step1.progress + participant.step2.progress > this.leader.step1.progress + this.leader.step2.progress)
                                {
                                    this.leader = participant;
                                }
                            }
                            else {
                                if(participant.step1.progress + participant.step2.progress > this.leader.step1.progress + this.leader.step2.progress)
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

