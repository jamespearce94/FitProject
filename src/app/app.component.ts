import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen, Health, Device} from 'ionic-native';
import {AuthenticationPage} from "../pages/authentication/authentication";
import {HomePage} from "../pages/home/home";
import {LeaderboardsPage} from "../pages/leaderboards/leaderboards";
import {UserService} from "../providers/user-service";
import {CompeteTabsPage} from "../pages/compete/tabs/compete-tabs";
import {FriendsTabsPage} from "../pages/friends/tabs/friends-tabs";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav : Nav;

    readonly rootPage = AuthenticationPage;
    public pages: Array<Object> = [
        {title: "Home", icon: "home", root: HomePage},
        {title: "Friends", icon: "people", root : FriendsTabsPage},
        {title: "Compete", icon: "stopwatch",root : CompeteTabsPage},
        {title: "Leader Boards", icon: "podium", root : LeaderboardsPage}
    ];

    constructor(private platform: Platform,
                private _userService: UserService) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // declare var cordova:any; you can do any higher level native things you might need.
            StatusBar.styleDefault();
            //
            if(Device.platform === 'Android'
                || Device.platform === 'iOS')
            {
                Health.isAvailable()
                    .then( (isAvailable) => {
                        let permissions = ['steps','calories','calories.active'];

                        Health.requestAuthorization( permissions )
                            .then( () => {
                            })
                            .catch( err => {
                              console.log('requestAuthorization',err);
                            });
                    })
                    .catch( err => {
                      console.log('isAvailable', err);
                    });
            }

            Splashscreen.hide();
        });
    }

    /**
     * Navigate to page
     * @param page
     */
    setRoot( page : any ) : void {
        this.nav.setRoot(page);
    }

    logout(){
        this._userService.logout();
        this.nav.setRoot(AuthenticationPage);
    }
}
