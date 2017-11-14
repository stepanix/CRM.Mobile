import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ScheduleServiceApi } from '../../shared/shared';
import { ScheduleRepoApi } from '../../repos/schedule-repo-api';

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

    eventDate: any = "";
    schedules: any[] = [];
    loader: any;
    scheduleId: any;
    repoId: any;
    isDataAvailable: boolean = false;
    placeId: any;

    options: CalendarModalOptions = {
        canBackwardsSelected: true
    };

    constructor(private loading: LoadingController,
        private scheduleRepoApi: ScheduleRepoApi,
        private navCtrl: NavController,
        private navParams: NavParams) {
        
    }

    ngOnInit() {
       
    }

    ionViewDidEnter(){
        this.eventDate = new Date().toISOString();
        this.placeId = this.navParams.get('placeId');
        this.isAnyPlaceCheckedIn();
    }

    isAnyPlaceCheckedIn() {
        this.scheduleRepoApi.getChekedInVisit().then((res) => {
            if (res.results.length > 0) {
                this.navCtrl.setRoot(VisitPage, {
                    scheduleId: res.results[0].RepoId,
                    repoId: res.results[0].RepoId,
                    placeId: parseInt(res.results[0].PlaceId),
                    placeName: res.results[0].PlaceName,
                    streetAddress: res.results[0].PlaceAddress,
                    lat: res.results[0].Latitude,
                    lng: res.results[0].Longitude
                });
            } else {
                this.listMyScheduleRepo();                
            }
        });
    }

    listSheduleDates() {
        let _daysConfig: DayConfig[] = [];
        this.scheduleRepoApi.listScheduleDates(this.placeId).then((res) => {
            if (res.length > 0) {
                for (let i = 0; i < res.length; i++) {
                    _daysConfig.push({
                        date: new Date(res[i].VisitDate),
                        subTitle: ".",
                    });
                }
                this.options.daysConfig = _daysConfig;
            }
            this.isDataAvailable = true;
        });
    }

   

    listMyScheduleRepo() {
        this.loader = this.loading.create({
            content: 'Busy please wait...',
        });
        this.loader.present().then(() => {
            let scheduleDate = moment(this.eventDate).format('YYYY-MM-DD').toString();
            this.schedules = [];
            this.scheduleRepoApi.listByDate(this.placeId, this.parseRepoDate(scheduleDate)).then((res) => {
                for (var i = 0; i < res.results.length; i++) {
                    this.schedules.push({
                        id: res.results[i].ServerId,
                        repoId: res.results[i].RepoId,
                        placeId: res.results[i].PlaceId,
                        place: res.results[i].PlaceName,
                        address: res.results[i].PlaceAddress,
                        time: this.parseScheduleTime(res.results[i].VisitTime),
                        visitStatus: this.parseStatus(res.results[i].VisitStatus),
                        latitude: res.results[i].Latitude,
                        longitude: res.results[i].Longitude,
                        isSynched: res.results[i].IsSynched,
                        isScheduled: res.results[i].IsScheduled,
                        isVisited: res.results[i].IsVisited,
                        isMissed: res.results[i].IsMissed,
                        isUnScheduled: res.results[i].IsUnScheduled,
                        scheduleStatus : this.parseScheduleStatus(res.results[i].IsUnScheduled,res.results[i].IsScheduled)
                    });
                }
                this.listSheduleDates();
                this.loader.dismiss();
            });
        });
    }

    parseStatus(status){
      if(status==="Out"){
          return "Visited";
      }
      if(status==="In"){
        return "On site";
      }
      if(status==="New visit" || status==="Scheduled"){
        return "Scheduled";
      }
      return status;
    }

    parseScheduleStatus(unscheduledStatus,scheduleStatus){
        if(unscheduledStatus==="true"){
            return "Unscheduled";
        }
        if(scheduleStatus==="true"){
            return "Scheduled";
        }
    }

    parseRepoDate(date): string {
        return date + "T00:00:00";
    }

    parseScheduleTime(time) {
        if (time === null || time === "") {
            return "Any Time";
        } else {
            return moment(time).format('HH:mm').toString();
        }
    }

    addSchedule() {
        this.navCtrl.push(AddSchedulePage);
    }

    createNewSchedule(item) {
        this.scheduleId = this.newGuid();
        this.repoId = this.newGuid();
        let ScheduleDto = {
            Id: this.scheduleId,
            RepoId: this.repoId,
            ServerId: 0,
            PlaceId: item.placeId,
            PlaceName: item.place,
            PlaceAddress: item.address,
            UserId: localStorage.getItem('userid'),
            VisitDate: moment().format('YYYY-MM-DD').toString(),
            VisitTime: moment().toISOString(),
            VisitNote: null,
            IsRecurring: false,
            RepeatCycle: 0,
            IsScheduled: false,
            IsVisited: true,
            IsMissed: false,
            IsUnScheduled: true,
            VisitStatus: 'In',
            Latitude: item.latitude,
            Longitude: item.longitude,
            CheckInTime: moment().toISOString(),
            IsSynched: 0
        };
    }

    openSchedule(item) {
        if (item.status === "Out") {
            this.createNewSchedule(item);
        } else {
            this.repoId = item.repoId;
        }
        this.navCtrl.setRoot(VisitPage, {
            scheduleId: this.repoId,
            repoId: this.repoId,
            placeId: item.placeId,
            placeName: item.place,
            streetAddress: item.address,
            lat: item.latitude,
            lng: item.longitude,
            status : item.status,
            serverId : item.id
        });
    }

    newGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}
