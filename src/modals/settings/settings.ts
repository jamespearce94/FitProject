import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class SettingsModal {

    constructor(private viewCtrl: ViewController) {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
