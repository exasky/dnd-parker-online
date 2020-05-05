// https://github.com/AndrewPoyntz/time-ago-pipe

import {Pipe, PipeTransform} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  constructor(private translate: TranslateService) {
  }

  transform(value: string) {
    let seconds = Math.round(Math.abs((new Date().getTime() - new Date(value).getTime()) / 1000));
    let minutes = Math.round(Math.abs(seconds / 60));
    let hours = Math.round(Math.abs(minutes / 60));
    let days = Math.round(Math.abs(hours / 24));
    let months = Math.round(Math.abs(days / 30.416));
    let years = Math.round(Math.abs(days / 365));

    if (Number.isNaN(seconds)) {
      return '';
    } else if (seconds <= 45) {
      return this.translate.instant("common.time.second_ago");
    } else if (seconds <= 90) {
      return this.translate.instant("common.time.minute_ago");
    } else if (minutes <= 45) {
      return this.translate.instant("common.time.minutes_ago", {X: minutes});
    } else if (minutes <= 90) {
      return this.translate.instant("common.time.hour_ago");
    } else if (hours <= 22) {
      return this.translate.instant("common.time.hours_ago", {X: hours});
    } else if (hours <= 36) {
      return this.translate.instant("common.time.day_ago");
    } else if (days <= 25) {
      return this.translate.instant("common.time.days_ago", {X: days});
    } else if (days <= 45) {
      return this.translate.instant("common.time.month_ago");
    } else if (days <= 345) {
      return this.translate.instant("common.time.months_ago", {X: months});
    } else if (days <= 545) {
      return 'a year ago';
    } else { // (days > 545)
      return years + ' years ago';
    }
  }
}
