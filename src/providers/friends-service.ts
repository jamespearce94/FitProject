import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {UserService} from "./user-service";
import {DateService} from "./date-service";
import {ToastController} from "ionic-angular";

@Injectable()
export class FriendsService {

    constructor(public http: Http,
                public af: AngularFire,
                public _userService: UserService,
                private _dateService: DateService,
                public toastCtrl: ToastController) {
    }

    getFriends(): FirebaseListObservable<any> {
        return this.af.database
            .list('/users/' + this._userService.user.auth.uid + '/friends');
    }

    getRequestLists(): FirebaseListObservable <any> {
        return this.af.database
            .list('/users/' + this._userService.user.auth.uid + '/friend_requests');
    }

    addFriend(uid: string, friendName: string) {
        this.af.database.object('users/' + uid + '/friend_requests/' + this._userService.user.auth.uid)
            .set({
                requestDate: this._dateService.getFormattedDate(),
                name: this._userService.user.auth.displayName
            })

        this.af.database.object('/users/' + this._userService.user.auth.uid + '/pending_requests/' + uid)
            .set({
                requestDate: this._dateService.getFormattedDate(),
                name: friendName
            })
            let toast = this.toastCtrl.create({
                message: 'Friend request was sent to ' + friendName,
                duration: 3500,
                position: 'middle'
            });
            toast.present();

    }


    acceptRequest(uid: string, friendName: string) {
        this.af.database.object('/users/' + this._userService.user.auth.uid + '/friend_requests/' + uid)
            .remove();

        this.af.database.object('/users/' + uid + '/pending_requests/' + this._userService.user.auth.uid)
            .remove();

        this.af.database.object('/users/' + uid + '/friends/' + this._userService.user.auth.uid)
            .set({
                name: this._userService.user.auth.displayName
            });
        this.af.database.object('/users/' + this._userService.user.auth.uid + '/friends/' + uid)
            .set({
                name: friendName
            });
    }

    deleteRequest(uid: string) {
        this.af.database.object('/users/' + this._userService.user.auth.uid + '/friend_requests/' + uid)
            .remove();

        this.af.database.object('/users/' + uid + '/pending_requests/' + this._userService.user.auth.uid)
            .remove();
    }


}