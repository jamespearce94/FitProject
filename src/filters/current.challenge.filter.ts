import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'CurrentFilter',
        pure: false})

export class CurrentFilter implements PipeTransform {
    transform(challenges, search) {
        return challenges.filter(challenge => {
            return challenge.isComplete === search;
        });
    }
}