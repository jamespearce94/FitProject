import {PipeTransform, Pipe} from "@angular/core";
import {BaseChallenge} from "../Classes/BaseChallenge";

@Pipe({name: 'CurrentFilter',
        pure: false})

export class CurrentFilter implements PipeTransform {
    transform(challenges, search) {
        return challenges.filter( ( challenge : BaseChallenge ) => {
            return challenge.checkIfCurrent() == search;
        });
    }
}