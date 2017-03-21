import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service";

@Component({
    selector: 'level-up-modal',
    templateUrl: 'level-up.modal.html'
})
export class LevelUpModal{

    level = null;
    loading = true;

    constructor(private viewCtrl: ViewController,
                private _userService : UserService) {
        this.level = viewCtrl.data
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}
