import * as moment from "moment";
import {HomePage} from "../home/home";
import {NavController} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import {OnInit, OnDestroy, Component} from "@angular/core";

@Component({
    selector: 'page-authentication',
    templateUrl: 'authentication.html'
})

export class AuthenticationPage implements OnInit, OnDestroy {
    // for ui changes
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
        signupDate: null
    };

    private error: String = null;

    constructor(private navCtrl: NavController,
                private _userService: UserService) {
    }

    ngOnInit() {
        // if authenticated go home page
        this.authSubscription = this._userService.auth
            .subscribe(user => {
                if (this._userService._isLoggedIn && user) {
                    this.navCtrl.setRoot(HomePage)
                }
            });
    }

    login() {
        // login with details from HTML form
        this._userService.login(this.loginModel)
            .catch((error) => {
                this.error = error.message;
                setTimeout(() => {
                    this.error = null;
                }, 2000);
            });
    }

    signup() {
        //get current time stamp
        this.signupModel.signupDate = moment().unix();
        // signup with details from HTML form
        this._userService.signup(this.signupModel);
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }
}