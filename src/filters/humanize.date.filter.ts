import {PipeTransform, Pipe} from "@angular/core";
import * as moment from "moment";

@Pipe({
    name: 'HumanizeDate',
    pure: false
})

export class HumanizeDateFilter implements PipeTransform {
    transform(date) {
        if(!date){
            return "Pending"
        }
        let diff = moment.unix(date).diff(moment(), 'minutes');
        return moment.duration(diff, 'minutes').humanize();
    }
}