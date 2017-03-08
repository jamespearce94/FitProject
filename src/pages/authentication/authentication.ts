import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-authentication',
    templateUrl: 'authentication.html'
})

export class AuthenticationPage implements OnInit, OnDestroy {

    public action: string = null;
    private authSubscription;
    private loginModel: any = {
        email: null,
        password: null
    };

    private signupModel: any = {
        email: null,
        password: null,
        name: null,
        goal: null
    };

    private error : String = null;

    constructor(private navCtrl: NavController,
                private _userService: UserService) {
    }

    ngOnInit(){
        this.authSubscription = this._userService.auth
            .subscribe( user => {
                if(this._userService._isLoggedIn && user){
                    this.navCtrl.setRoot(HomePage)
                }
            });
    }

    ionViewDidLoad() {
    }

    login() {
        this._userService.login(this.loginModel)
            .catch((error) => {
                this.error = error.message;
                setTimeout(() => { this.error = null;}, 2000);
            });
    }

    signup() {
        this._userService.signup(this.signupModel);
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }
}