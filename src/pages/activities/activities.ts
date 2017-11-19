import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController,Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PlacesPage } from '../places/places';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { TimeMileageRepoApi } from '../../repos/timemileage-repo-api';
import { ScheduleRepoApi } from '../../repos/schedule-repo-api';

import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';



@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
})
export class ActivitiesPage {

    loader: any;    
    start: boolean = true;
    pause: boolean = false;
    stop: boolean = false;
    workDay: any = "Workday : 0 hrs";
    TimeMileageModel: any = {};
    pauseTotal: any = "0";
    @ViewChild('history') history;

    constructor(private ev : Events,
        private scheduleRepoApi: ScheduleRepoApi,
        private counterNotifications: LocalNotifications,
        private timeMileageRepoAPi: TimeMileageRepoApi,
        public alertCtrl: AlertController,
        private activityRepoApi: ActivityRepoApi,
        private syncServiceApi: SyncServiceApi,
        private loading: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {

        // this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        //     if (canRequest) {
        //         // the accuracy option will be ignored by iOS
        //         this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        //             () => console.log('Request successful'),
        //             error => console.log('Error requesting location permissions', error)
        //         );
        //     }
        // });
        this.ev.subscribe('activity', name => {
            this.history.listPlaceRepo();
        });
                
        this.checkMissedSchedule();
        this.getWorkDuration();
        this.checkWorkStatus();
    }

    ionViewDidEnter(){
        this.history.listPlaceRepo();
    }

    checkMissedSchedule() {
        this.scheduleRepoApi.updateMissedSchedule();
    }

    addTimerNotification() {
        this.counterNotifications.schedule({
            id: 2,
            title: 'Timer counter active',
            ongoing: true,
            data: null,
            every: 'second',
            sound: null
        });
    }

    cancelAllNotifications() {
        this.counterNotifications.cancel(2);
    }

    getWorkDuration() {
        if (localStorage.getItem('workStatus') === "stopped") {
            this.timeMileageRepoAPi
                .searchByDate(moment().format("YYYY-MM-DD"))
                .then((res) => {
                    if (res.results.length > 0) {
                        this.workDay = res.results[0].Duration;
                    }
                });
        }
    }

    parseMillisecondsIntoReadableTime(milliseconds) {
        //Get hours from milliseconds
        var hours = milliseconds / (1000 * 60 * 60);
        var absoluteHours = Math.floor(hours);
        var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

        //Get remainder from hours and convert to minutes
        var minutes = (hours - absoluteHours) * 60;
        var absoluteMinutes = Math.floor(minutes);
        var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

        //Get remainder from minutes and convert to seconds
        var seconds = (minutes - absoluteMinutes) * 60;
        var absoluteSeconds = Math.floor(seconds);
        var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


        return h + ':' + m + ':' + s;
    }

    checkWorkStatus() {
        let startTime: any = new Date(localStorage.getItem('startTime')).getTime();
        let endTime: any = new Date(moment().format()).getTime();
        let duration: number = (endTime - startTime);
        // console.log("starttime", startTime);
        // console.log("endTime", endTime);
        // console.log("duration", this.parseMillisecondsIntoReadableTime(duration));
        if (Number.isNaN(duration) || startTime === 0 || startTime === "0") {
            duration = 0;
            this.workDay = "Workday: 0:00 hrs";
        } else {
            if (localStorage.getItem('workStatus') !== "stopped") {
                this.workDay = "Workday: " + this.parseMillisecondsIntoReadableTime(duration) + " hrs";
            }
        }
        if (localStorage.getItem('workStatus') === "started") {
            this.start = false;
            this.pause = true;
            this.stop = true;
        }
        if (localStorage.getItem('workStatus') === "stopped") {
            this.start = true;
            this.pause = false;
            this.stop = false;
        }
        if (localStorage.getItem('workStatus') === "paused") {
            this.start = true;
            this.pause = false;
            this.stop = false;
        }
        if (localStorage.getItem('lastMileageDate') === moment().format("YYYY-MM-DD").toString()
            && localStorage.getItem('workStatus') !== "started" && localStorage.getItem('workStatus') !== "paused") {
            this.start = false;
            this.pause = false;
            this.stop = false;
        }
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

    startWork() {
        if (localStorage.getItem('workStatus') === "paused") {
            localStorage.setItem('workStatus', "started");
            let pauseTime: any = new Date(localStorage.getItem('pauseTime')).getTime();
            let resumeTime: any = new Date(moment().format()).getTime();
            this.pauseTotal = (resumeTime - pauseTime);
            this.checkWorkStatus();
        } else {
            let alertConfirm = this.alertCtrl.create({
                title: '',
                message: 'Are you sure you want to start your day ?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('No clicked');
                        }
                    },
                    {
                        text: 'Start day',
                        handler: () => {
                            let startTime = moment().format();
                            this.TimeMileageModel = {
                                Id: this.newGuid(),
                                ServerId: 0,
                                UserId: localStorage.getItem('userid'),
                                PlaceId: null,
                                PlaceName: null,
                                StartTime: startTime,
                                EndTime: null,
                                Duration: this.workDay,
                                Mileage: "0",
                                IsSynched: 1,
                                DateCreated: moment().format("YYYY-MM-DD")
                            }
                            //this.timeMileageRepoAPi.insertRecord(TimeMileageModel);
                            localStorage.setItem('startTime', startTime);
                            localStorage.setItem('lastMileageDate', moment().format("YYYY-MM-DD"));
                            localStorage.setItem('workStatus', "started");
                            this.addTimerNotification();
                            this.checkWorkStatus();
                        }
                    }
                ]
            });
            alertConfirm.present();
        }
    }

    pauseWork() {
        let pauseTime = new Date(moment().format()).getTime();
        localStorage.setItem('workStatus', "paused");
        localStorage.setItem("pauseTime", pauseTime.toString());
        this.checkWorkStatus();
    }

    stopWork() {
        let alertConfirm = this.alertCtrl.create({
            title: '',
            message: 'Are you sure you want to end your day ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'End day',
                    handler: () => {
                        this.setEndTimeMileage();
                    }
                }
            ]
        });
        alertConfirm.present();
    }

    setEndTimeMileage() {
        //this.timeMileageRepoAPi.searchByDate(localStorage.getItem('lastMileageDate')).then((res) => {
            //if (res.results.length > 0) {
                let startTime: any = new Date(localStorage.getItem('startTime')).getTime();
                let endTime: any = new Date(moment().format()).getTime();
                let duration: number = (endTime - startTime);
                this.workDay = "Workday: " + this.parseMillisecondsIntoReadableTime(duration) + " hrs";
                this.TimeMileageModel = {
                    Id: this.newGuid(),
                    ServerId: 0,
                    UserId: localStorage.getItem('userid'),
                    PlaceId: null,
                    PlaceName: null,
                    StartTime: moment(localStorage.getItem('startTime')).format("YYYY-MM-DD HH:mm"),
                    EndTime: moment().format("YYYY-MM-DD HH:mm"),
                    Duration: this.workDay,
                    Mileage: localStorage.getItem("mileage"),
                    IsSynched: 0,
                    DateCreated: moment().format("YYYY-MM-DD HH:mm")
                };
                localStorage.setItem('lastMileageDate', moment().format("YYYY-MM-DD"));
                localStorage.setItem('workStatus', "stopped");
                this.timeMileageRepoAPi.insertRecord(this.TimeMileageModel);
                this.cancelAllNotifications();
                this.checkWorkStatus();
                this.syncServiceApi.downloadServerData();
           // }
        //});
    }

    ngAfterContentInit() {
        var token = localStorage.getItem('token');

        if (token === null || token === undefined || token === "null") {
            this.navCtrl.setRoot(LoginPage);
        } else {
            //this.syncServiceApi.downloadServerData();
        }
    }

    navigateToPlaces() {
        this.navCtrl.setRoot(PlacesPage);
    }

}
