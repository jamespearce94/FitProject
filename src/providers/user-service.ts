import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {
    AngularFire, AngularFireAuth, FirebaseAuthState, FirebaseListObservable,
    FirebaseObjectObservable
} from "angularfire2";
import * as moment from "moment";

@Injectable()
export class UserService {

    public user: any = {};
    private isLoggedIn: boolean = false;
    readonly auth: AngularFireAuth;

    constructor(private http: Http,
                private af: AngularFire) {
        this.auth = af.auth;

        this.af.auth.subscribe(auth => {
            this.user = auth;
            this.isLoggedIn = auth !== null;
        });
    }

    public get _isLoggedIn(): boolean {
        return this.isLoggedIn;

    }

    login(loginModel): firebase.Promise<FirebaseAuthState> {
        return this.af.auth.login(loginModel);
    }

    getUserList(): FirebaseListObservable<any> {
        return this.af.database
            .list('/users');
    }

    getUser( userId : string ) : FirebaseObjectObservable<any> {
        return this.af.database
            .object('/users/' + userId );
    }

    signup(signupModel) {
        this.af.auth.createUser(signupModel)
            .then((result) => {
                result.auth.updateProfile({
                    displayName: signupModel.name,
                    photoURL: null
                }).then(() => {
                    this.af.database.object('users/' + result.uid + '/fitness_stats')
                        .set({
                            current_cycling_distance: 0,
                            current_steps: 0,
                            current_walking_distance: 0,
                            current_weight: 0,
                            goal_weight: signupModel.goal,
                            height: 0,
                            last_update: moment().unix(),
                            lifetime_walking_distance: 0,
                            lifetime_steps: 0,
                            lifetime_cycling_distance: 0,
                            name: signupModel.name,
                            signup_date: moment().unix()
                        });
                    this.af.database.object('users/' + result.uid + '/leveldata')
                        .set({
                            current_experience: 0,
                            experience_name: 'Beginner',
                            level: 1
                        })
                });
            });
    }

    logout() {
        this.isLoggedIn = false;
        return this.af.auth.logout();
    }
}
