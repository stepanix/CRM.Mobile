import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ScheduleServiceApi} from '../../shared/shared';
import * as moment from 'moment';

@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html',
})

export class SchedulePage {

    eventDate : any = "";
    schedules : any[] = [];

    constructor(private scheduleServiceApi: ScheduleServiceApi,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.eventDate = new Date().toISOString();
    }

    ionViewDidLoad() {
      this.listMySchedulesApi();
    }

    listMySchedulesApi() {
      let scheduleDate =  moment(this.eventDate).format('YYYY-MM-DD').toString();
      this.schedules = [];
      this.scheduleServiceApi.getMySchedules(scheduleDate)
      .subscribe(
           res => {
             for(var i=0; i< res.length; i++){
                this.schedules.push({
                    id:res[i].id,
                    place: res[i].place.name,
                    address : res[i].place.streetAddress,
                    time: this.parseScheduleTime(res[i].visitTime)
                 });
              }
           },err => {
             console.log(err);
             return;
         });
    }

    parseScheduleTime(time) {
        if (time === null) {
           return "Any Time";
        }else{
           return moment(time).format('HH:mm').toString();
        }
    }



}
