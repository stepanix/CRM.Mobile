import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {ScheduleServiceApi} from '../../shared/shared';
import {
  CalendarComponentOptions,
  CalendarModalOptions,
  CalendarModal,
  DayConfig
} from 'ion2-calendar'
import * as moment from 'moment';

@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html',
})

export class SchedulePage {

    eventDate : any = "";
    schedules : any[] = [];
    loader : any;

    options: CalendarModalOptions = {
      canBackwardsSelected : true
    };

    constructor(private loading: LoadingController,
        private scheduleServiceApi: ScheduleServiceApi,
        private navCtrl: NavController,
        private navParams: NavParams) {
        this.eventDate = new Date().toISOString();
    }

    ionViewDidLoad() {
      this.listMySchedulesApi();
    }

    listMySchedulesApi() {
      this.loader = this.loading.create({
        content: 'Busy please wait...',
      });
      this.loader.present().then(() => {
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
                        time: this.parseScheduleTime(res[i].visitTime),
                        status : res[i].visitStatus
                    });
                  }
                  this.loader.dismiss();
              },err => {
                this.loader.dismiss();
                console.log(err);
                return;
            });
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
