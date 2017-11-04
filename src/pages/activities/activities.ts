import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PlacesPage } from '../places/places';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { TimeMileageRepoApi } from '../../repos/timemileage-repo-api';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { PhotoPage } from '../photo/photo';
import { NotePage } from '../note/note';
import { FormPage } from '../form/form';
import { RetailAuditFormPage } from '../retailauditform/retailauditform';
import { ListProductPage } from '../listproduct/listproduct';
import { OrdersPage } from '../orders/orders';


@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
})
export class ActivitiesPage {

    loader: any;
    activities: any[] = [];
    start: boolean = true;
    pause: boolean = false;
    stop: boolean = false;
    workDay: any = "Workday : 0 hrs";
    TimeMileageModel: any = {};
    pauseTotal : any = "0";

    constructor(private counterNotifications: LocalNotifications,
        private timeMileageRepoAPi: TimeMileageRepoApi,
        public alertCtrl: AlertController,
        private activityRepoApi: ActivityRepoApi,
        private syncServiceApi: SyncServiceApi,
        private loading: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.getWorkDuration();
        this.checkWorkStatus();
    }

    navigatePage(type, logId, item) {
        if (type === "Forms") {
            this.navCtrl.setRoot(FormPage, {
                Id: logId,
                placeName: item.placeName,
                placeId: item.placeId
            });
        }
        if (type === "Product Retail Audit") {
            this.navCtrl.setRoot(RetailAuditFormPage, {
                Id: logId,
                placeName: item.placeName,
                placeId: item.placeId
            });
        }
        if (type === "Photos") {
            this.navCtrl.setRoot(PhotoPage, {
                Id: logId,
                placeName: item.placeName,
                placeId: item.placeId
            });
        }
        if (type === "Notes") {
            this.navCtrl.setRoot(NotePage, {
                Id: logId,
                placeName: item.placeName,
                placeId: item.placeId
            });
        }
        if (type === "Orders") {
            this.navCtrl.push(OrdersPage, {
                Id: logId,
                orderId: logId,
                placeName: item.placeName,
                placeId: item.placeId
            });
        }
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
        if(localStorage.getItem('workStatus') ==="paused") {
            localStorage.setItem('workStatus', "started");
            let pauseTime : any  = new Date(localStorage.getItem('pauseTime')).getTime();
            let resumeTime : any = new Date(moment().format()).getTime();
            this.pauseTotal = (resumeTime - pauseTime);
            this.checkWorkStatus();
        }else{
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
                            let TimeMileageModel = {
                                Id: this.newGuid(),
                                ServerId: 0,
                                UserId: localStorage.getItem('userid'),
                                PlaceId: null,
                                PlaceName: null,
                                StartTime: startTime,
                                EndTime: null,
                                Duration: this.workDay,
                                Mileage: "0",
                                IsSynched: 0,
                                DateCreated: moment().format("YYYY-MM-DD")
                            }
                            this.timeMileageRepoAPi.insertRecord(TimeMileageModel);
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
        localStorage.setItem("pauseTime",pauseTime.toString());
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
        this.timeMileageRepoAPi.searchByDate(localStorage.getItem('lastMileageDate')).then((res) => {
            if (res.results.length > 0) {
                let startTime: any = new Date(localStorage.getItem('startTime')).getTime();
                let endTime: any = new Date(moment().format()).getTime();
                let duration: number = (endTime - startTime);
                this.workDay = "Workday: " + this.parseMillisecondsIntoReadableTime(duration) + " hrs";
                this.TimeMileageModel = {
                    Id: res.results[0].Id,
                    ServerId: res.results[0].Id,
                    UserId: localStorage.getItem('userid'),
                    PlaceId: null,
                    PlaceName: null,
                    StartTime: res.results[0].StartTime,
                    EndTime: moment().format("YYYY-MM-DD HH:mm"),
                    Duration: this.workDay,
                    Mileage: localStorage.getItem("mileage"),
                    IsSynched: 0,
                    DateCreated: res.results[0].DateCreated
                };
                this.timeMileageRepoAPi.updateMileage(this.TimeMileageModel);
                localStorage.setItem('lastMileageDate', moment().format("YYYY-MM-DD"));
                localStorage.setItem('workStatus', "stopped");
                this.cancelAllNotifications();
                this.checkWorkStatus();
            }
        });
    }    

    ngAfterContentInit() {
        var token = localStorage.getItem('token');

        if (token === null || token === undefined || token === "null") {
            this.navCtrl.setRoot(LoginPage);
        } else {
            this.getActivityLog();
            this.loader = this.loading.create({
                content: 'Synching data, please wait...',
            });
        }
    }

    getActivityLog() {
        this.activities = [];
        this.activityRepoApi.listAll().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                this.activities.push({
                    ActivityTypeId: res.results[i].ActivityTypeId,
                    placeId: parseInt(res.results[i].PlaceId),
                    placeName: res.results[i].PlaceName,
                    ActivityLog: res.results[i].ActivityLog,
                    DateCreated: moment(res.results[i].DateCreated).format("lll")
                });
            }
        });
    }

    ionViewDidLoad() {

    }

    navigateToPlaces() {
        this.navCtrl.setRoot(PlacesPage);
    }

}
