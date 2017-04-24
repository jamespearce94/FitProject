import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {AuthenticationPage} from "../pages/authentication/authentication";
import {FormsModule} from "@angular/forms";
import {AngularFireModule, AuthProviders, AuthMethods} from 'angularfire2';
import {UserService} from "../providers/user-service";
import {ChallengeService} from "../providers/challenge-service";
import {StatsService} from "../providers/stats-service";
import {FriendsService} from "../providers/friends-service";
import {FriendsPage} from "../pages/friends/friends";
import {CompetePage} from "../pages/compete/compete";
import {CompeteTabsPage} from "../pages/compete/tabs/compete-tabs";
import {LeaderboardsPage} from "../pages/leaderboards/leaderboards";
import {FriendsTabsPage} from "../pages/friends/tabs/friends-tabs";
import {HealthKitService} from "../providers/healthkit-service";
import {UserSearchPage} from "../pages/user-search/user-search";
import {FriendRequestsPage} from "../pages/friend-requests/friend-requests";
import {UserNameFilter} from "../filters/user.name.filter";
import {LevelService} from "../providers/level-service";
import {ChallengeListPage} from "../pages/challenge-list/challenge-list";
import {ChallengeIdFilter} from "../filters/challenge.id.filter";
import {CompeteInvitePage} from "../pages/compete/invite/invite";
import {ViewChallengeModal} from "../modals/view-challenge/view-challenge.modal";
import {CompletedChallengesPage} from "../pages/compete/completed-challenges/completed-challenges";
import {CurrentFilter} from "../filters/current.challenge.filter";
import {HumanizeDateFilter} from "../filters/humanize.date.filter";
import {LevelUpModal} from "../modals/level-up.modal/level-up.modal";
import {ChallengeCompleteModal} from "../modals/challenge-complete/challenge-complete.modal";
import {EventService} from "../providers/event.service";
import {NotificationService} from "../providers/notification-service";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {ChallengeFailedModal} from "../modals/challenge-failed/challenge-failed.modal";
import {MultiStepChallenge} from "../Classes/MultiStepChallenge";
import {MultiStepChallengeModal} from "../modals/multistep-challenges/multistep-challenges.modal";
//Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyBREEQOeO1de92knkA8xhiCMZCKiwo3Byo",
    authDomain: "fitchallengesproject.firebaseapp.com",
    databaseURL: "https://fitchallengesproject.firebaseio.com",
    storageBucket: "fitchallengesproject.appspot.com",
    messagingSenderId: "557444567153"
};

const firebaseAuthConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        FriendsTabsPage,
        AuthenticationPage,
        FriendsPage,
        CompeteTabsPage,
        CompetePage,
        CompeteInvitePage,
        UserSearchPage,
        FriendRequestsPage,
        UserNameFilter,
        ChallengeListPage,
        ChallengeIdFilter,
        HumanizeDateFilter,
        CurrentFilter,
        ViewChallengeModal,
        CompletedChallengesPage,
        LevelUpModal,
        ChallengeCompleteModal,
        ChallengeFailedModal,
        MultiStepChallengeModal
    ],
    imports: [
        IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
        AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
        FormsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        FriendsTabsPage,
        AuthenticationPage,
        FriendsPage,
        CompeteTabsPage,
        CompetePage,
        CompeteInvitePage,
        UserSearchPage,
        FriendRequestsPage,
        ChallengeListPage,
        ViewChallengeModal,
        CompletedChallengesPage,
        LevelUpModal,
        ChallengeCompleteModal,
        ChallengeFailedModal,
        MultiStepChallengeModal

    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        UserService,
        ChallengeService,
        StatsService,
        FriendsService,
        HealthKitService,
        EventService,
        UserNameFilter,
        LevelService,
        ChallengeIdFilter,
        CurrentFilter,
        HumanizeDateFilter,
        NotificationService,
        LocalNotifications
    ]
})
export class AppModule {
}
