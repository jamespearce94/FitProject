import {Component, OnInit} from '@angular/core';
import {FriendsPage} from "../friends";
import {FriendRequestsPage} from "../../friend-requests/friend-requests";
import {FriendsService} from "../../../providers/friends-service";

@Component({
    templateUrl: 'friends-tabs.html'
})
export class FriendsTabsPage implements OnInit {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = FriendsPage;
    tab2Root: any = FriendRequestsPage;

    private noOfRequests: number = 0;


    constructor(private _friendService: FriendsService) {

    }

    ngOnInit() {
        this._friendService.getRequestLists()
            .subscribe((requests) => {
                if (requests.length) {
                    this.noOfRequests = requests.length;
                }
                else{
                    this.noOfRequests = 0;
                }
            })
    }
}
