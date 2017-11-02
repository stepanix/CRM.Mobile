import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PlacesPage } from '../places/places';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { TimeMileageRepoApi } from '../../repos/timemileage-repo-api';
import * as moment from 'moment';


@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
})
export class ActivitiesPage {

    loader: any;
    activities: any[] = [];
    start :boolean = true;
    pause : boolean = false;
    stop : boolean = false;
    workDay : any = "Workday : 0 hrs";
    TimeMileageModel : any = {};

    constructor(private timeMileageRepoAPi : TimeMileageRepoApi,
        public alertCtrl: AlertController,
        private activityRepoApi: ActivityRepoApi,
        private syncServiceApi: SyncServiceApi,
        private loading: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.checkWorkStatus();
    }

    checkWorkStatus() {
        let startTime :any = Date.parse(localStorage.getItem('startTime'));
        let endTime : any = Date.parse(moment().format("YYYY-MM-DD HH:mm"));
        let duration : number = (endTime - startTime);

        this.workDay = "Workday: " + duration + " hrs";

        if(localStorage.getItem('workStatus')==="started") {
            this.start = false;
            this.pause = true;
            this.stop = true;
        }
        if(localStorage.getItem('workStatus')==="stopped") {
            this.start = true;
            this.pause = false;
            this.stop = false;
        }
        if(localStorage.getItem('workStatus')==="paused") {
            this.start = true;
            this.pause = false;
            this.stop = true;
        }
        if(localStorage.getItem('lastMileageDate') === moment().format("YYYY-MM-DD").toString() 
        && localStorage.getItem('workStatus') !== "started"){
            this.start = false;
            this.pause = false;
            this.stop = false;
        } 
    }

    startWork(){
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
                  let TimeMileageModel = {
                    Id: this.newGuid(),
                    ServerId : 0,
                    UserId: localStorage.getItem('userid'),
                    PlaceId: null,
                    PlaceName: null,
                    StartTime : moment().format("YYYY-MM-DD HH:mm"),
                    EndTime: null,
                    Duration: "0",
                    Mileage: "0",
                    IsSynched: 0,
                    DateCreated : moment().format("YYYY-MM-DD")
                  }
                  this.timeMileageRepoAPi.insertRecord(TimeMileageModel);
                  localStorage.setItem('lastMileageDate',moment().format("YYYY-MM-DD"));
                  localStorage.setItem('workStatus',"started");
                  this.checkWorkStatus();
                }
              }
            ]
          });
          alertConfirm.present();
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

    stopWork(){
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
                let startTime :any = Date.parse(res.results[0].StartTime);
                let endTime : any = moment().format("YYYY-MM-DD HH:mm");
                let endTimeConverted : any = Date.parse(moment().format("YYYY-MM-DD HH:mm"));
                let duration : number = (endTimeConverted - startTime);
                this.TimeMileageModel = {
                    Id: res.results[0].Id,
                    ServerId : res.results[0].Id,
                    UserId: localStorage.getItem('userid'),
                    PlaceId: null,
                    PlaceName: null,
                    StartTime : res.results[0].StartTime,
                    EndTime: moment().format("YYYY-MM-DD HH:mm"),
                    Duration: duration,
                    Mileage: "0",
                    IsSynched: 0,
                    DateCreated : res.results[0].DateCreated
                  };
                  this.workDay = "Workday: " + duration + " hrs";
                  this.timeMileageRepoAPi.updateMileage(this.TimeMileageModel);
                  localStorage.setItem('lastMileageDate',moment().format("YYYY-MM-DD"));
                  localStorage.setItem('workStatus',"stopped");
                  this.checkWorkStatus();
              }
          });
    }

    pauseWork(){
        localStorage.setItem('workStatus',"paused");
        this.checkWorkStatus();
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
            this.loader.present().then(() => {
                this.syncServiceApi.downloadServerData();
                this.loader.dismiss();
            });
        }
    }



    getActivityLog() {
        this.activities = [];
        this.activityRepoApi.listAll().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                this.activities.push({
                    PlaceName: res.results[i].PlaceName,
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
