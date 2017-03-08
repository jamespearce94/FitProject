import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {AuthenticationPage} from "../authentication/authentication";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public userService: UserService) {

  }

  logout(){
    this.userService.logout();
    this.navCtrl.parent.parent.setRoot(AuthenticationPage);
  }


}
