import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable()
export class EventService
{
    private activeChallengesReadyEvent : Subject<string> = new Subject<string>();

    public activeChallengesReadyAnnounced = this.activeChallengesReadyEvent.asObservable();

    constructor( ) { }

    announceActiveChallenges( ) {
        // can be called anywhere to update challenge progress
        this.activeChallengesReadyEvent.next();
    }
}