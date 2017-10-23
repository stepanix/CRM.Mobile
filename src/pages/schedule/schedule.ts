import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {ScheduleServiceApi} from '../../shared/shared';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';

import {
  CalendarComponentOptions,
  CalendarModalOptions,
  CalendarModal,
  DayConfig
} from 'ion2-calendar'
import * as moment from 'moment';
import { AddSchedulePage } from '../addschedule/addschedule';
import { VisitPage } from '../visit/visit';

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
        private scheduleRepoApi : ScheduleRepoApi,
        private scheduleServiceApi: ScheduleServiceApi,
        private navCtrl: NavController,
        private navParams: NavParams) {
        this.eventDate = new Date().toISOString();
    }

    ionViewDidLoad() {
       this.listMyScheduleRepo();
    }

    listSchedule() {
       this.listMyScheduleRepo();
    }

    listMyScheduleRepo() {
            this.loader = this.loading.create({
                content: 'Busy please wait...',
            });
            this.loader.present().then(() => {
                let scheduleDate = moment(this.eventDate).format('YYYY-MM-DD').toString();
                this.schedules = [];
            this.scheduleRepoApi.listByDate(this.parseRepoDate(scheduleDate)).then((res) => {
                for(var i = 0; i<res.results.length;i++) {
                     this.schedules.push({
                         id : res.results[i].ServerId,
                         repoId : res.results[i].RepoId,
                         placeId : res.results[i].PlaceId,
                         place : res.results[i].PlaceName,
                         address : res.results[i].PlaceAddress,
                         time : this.parseScheduleTime(res.results[i].VisitTime),
                         status : res.results[i].VisitStatus,
                         latitude : res.results[i].Latitude,
                         longitude : res.results[i].Longitude,
                         isSynched : res.results[i].IsSynched
                     });
                 }
                 this.loader.dismiss();
             });
         });
    }

    parseRepoDate(date):string {
       return date + "T00:00:00";
    }    

    parseScheduleTime(time) {
        if (time === null || time==="") {
           return "Any Time";
        }else{
           return moment(time).format('HH:mm').toString();
        }
    }

    addSchedule() {
       this.navCtrl.push(AddSchedulePage);
    }

    openSchedule(item) {
        this.navCtrl.push(VisitPage, {
            scheduleId : item.repoId,
            repoId : item.repoId,
            placeId : item.placeId,
            placeName : item.place,
            streetAddress : item.address,
            lat : item.latitude,
            lng : item.longitude
         });
    }

    newGuid() : string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

}
