import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'challengeIdFilter'})

export class ChallengeIdFilter implements PipeTransform {
    transform(challenges, userSubbedChallenges) {
        return challenges.filter(challenge => {
            //return matching base and active challenges
            return userSubbedChallenges.filter(userSubChallenge => {
                return userSubChallenge.id === challenge.$key
            }).length
        });
    }
}