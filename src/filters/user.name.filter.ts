import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'userNameFilter'})
export class UserNameFilter implements PipeTransform {

    transform(users, search) {
        return users == undefined || search == undefined ? users : users.filter((user) => {
                return user.fitness_stats.name.toLowerCase().includes(search.toLowerCase());
            });
    }
}