import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { ListFormsPage } from '../listforms/listforms';
import { ListRetailAuditFormPage } from '../listretailauditform/listretailauditform';
import { ScheduleRepoApi } from '../../repos/schedule-repo-api';
import { SchedulePage } from '../schedule/schedule';
import { PhotoPage } from '../photo/photo';
import { NotePage } from '../note/note';
import { FormPage } from '../form/form';
import { RetailAuditFormPage } from '../retailauditform/retailauditform';
import { ListProductPage } from '../listproduct/listproduct';
import { OrdersPage } from '../orders/orders';

import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { TimeMileageRepoApi } from '../../repos/timemileage-repo-api';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  selector: 'page-visit',
  templateUrl: 'visit.html',
})

export class VisitPage {

  scheduleId: any;
  placeId: any;
  placeName: any;
  streetAddress: any;
  lat: any;
  lng: any;
  dataDtoIn: any = {};
  hideCheckOutButton: boolean = false;
  visitStatus = "";
  repoId: any;
  activities: any[] = [];
  currentLat: number = 0;
  currentLng: number = 0;
  currentDist: number = 0;
  serverId: any = "";
  status: any = "";
  isUnscheduled: any = "false";
  @ViewChild('history') history;

  constructor(private ev: Events,
    private timeMileageRepoAPi: TimeMileageRepoApi,
    private counterNotifications: LocalNotifications,
    private localNotifications: LocalNotifications,
    private activityRepoApi: ActivityRepoApi,
    private scheduleRepoApi: ScheduleRepoApi,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.currentLat = parseFloat(localStorage.getItem("lat"));
    this.currentLng = parseFloat(localStorage.getItem("lng"));
  }

  ionViewDidLoad() {
  }

  openSchedule() {
    this.navCtrl.setRoot(SchedulePage, {
      placeId: this.placeId
    });
  }

  ionViewWillEnter() {
    this.serverId = this.navParams.get('serverId');
    this.repoId = this.navParams.get('repoId');
    this.scheduleId = this.navParams.get('repoId');
    this.placeId = this.navParams.get('placeId');
    this.placeName = this.navParams.get('placeName');
    this.streetAddress = this.navParams.get('streetAddress');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
    this.status = this.navParams.get('status');
    this.isUnscheduled = this.navParams.get('isUnscheduled');
    this.getScheduleData();
    this.ev.subscribe('activity', name => {
      this.history.listPlaceRepo();
    });
    // console.log("serverid", this.serverId);
    // console.log("repoid", this.repoId);
    // console.log("scheduleid", this.scheduleId);
  }

  ionViewDidEnter() {
    this.history.listPlaceRepo();
  }

  getScheduleData() {
    this.scheduleRepoApi.listByScheduleId(this.repoId, this.serverId).then((res) => {
      if (res.results.length > 0) {
        this.dataDtoIn = res.results[0];
        if (this.dataDtoIn.VisitStatus === "In") {
          this.visitStatus = this.dataDtoIn.VisitStatus;
          this.hideCheckOutButton = false;
        } else {
          this.hideCheckOutButton = true;
        }
      } else {
        this.dataDtoIn.ServerId = 0;
        this.visitStatus = "";
        this.hideCheckOutButton = true;
      }
    });
  }

  enterSchedule() {
    if (this.isUnscheduled === "true") {
      this.createNewSchedule();
    } else {
      this.updateScheduleStatus();
    }
  }

  checkInPlace() {
    this.scheduleId = this.newGuid();
    this.repoId = this.scheduleId;
    this.createNewSchedule();
    this.addNotifications();
    this.getScheduleData();
    this.startDay();
  }

  addNotifications() {
    let checkedInData = {
      repoId: this.repoId,
      scheduleId: this.scheduleId,
      placeId: this.placeId,
      placeName: this.placeName,
      streetAddress: this.streetAddress,
      lat: this.lat,
      lng: this.lng
    }

    this.localNotifications.schedule({
      id: 1,
      title: 'Checked in at ' + this.placeName,
      ongoing: true,
      data: checkedInData,
      every: 'second',
      sound: null
    });
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
    this.localNotifications.cancel(1);
    this.navCtrl.setRoot(SchedulePage);
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

  updateScheduleStatus() {
    this.currentDist = this.computeMileage(this.currentLat, this.currentLng, parseFloat(this.lat), parseFloat(this.lng), "K");
    this.dataDtoIn.CheckInDistance = this.currentDist.toFixed(2);
    this.dataDtoIn.CheckInTime = moment().format("YYYY-MM-DD HH:mm");
    this.dataDtoIn.VisitStatus = "In";
    this.dataDtoIn.IsSynched = 0;
    this.dataDtoIn.RepoId = this.repoId;
    this.dataDtoIn.ServerId = this.serverId;
    this.scheduleRepoApi.checkInVisit(this.dataDtoIn);
  }

  createNewSchedule() {
    if (this.scheduleId === undefined
      || this.scheduleId === "undefined"
      || this.scheduleId === ""
      || this.scheduleId === "null"
      || this.scheduleId === null) {
      this.scheduleId = this.newGuid();
    }
    this.currentDist = this.computeMileage(this.currentLat, this.currentLng, parseFloat(this.lat), parseFloat(this.lng), "K");
    let ScheduleDto = {
      Id: this.scheduleId,
      RepoId: this.scheduleId,
      ServerId: 0,
      PlaceId: this.placeId,
      PlaceName: this.placeName,
      PlaceAddress: this.parseStreetAddress(this.streetAddress),
      UserId: localStorage.getItem('userid'),
      VisitDate: moment().format("YYYY-MM-DD") + "T00:00:00",
      VisitTime: moment().format("YYYY-MM-DD HH:mm"),
      CheckInTime: moment().format("YYYY-MM-DD HH:mm"),
      CheckInDistance: this.currentDist.toFixed(2),
      CheckOutDistance: "0",
      VisitNote: "",
      IsRecurring: false,
      RepeatCycle: 0,
      IsScheduled: false,
      IsVisited: true,
      IsMissed: false,
      IsUnScheduled: true,
      VisitStatus: 'In',
      Latitude: this.lat,
      Longitude: this.lng,
      IsSynched: 0
    };
    this.scheduleRepoApi.insertRecord(ScheduleDto);
  }

  computeMileage(lat1, lon1, lat2, lon2, unit): number {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  parseStreetAddress(address) {
    if (address === undefined) {
      return "";
    } else {
      return address;
    }
  }

  checkIn(type) {
    if (this.visitStatus !== "In") {
      let confirm = this.alertCtrl.create({
        title: 'Do you want to check in at ' + this.placeName + ' ?',
        buttons: [
          {
            text: 'Check in here',
            handler: () => {
              this.hideCheckOutButton = false;
              this.enterSchedule();
              if (type === "form") {
                this.navCtrl.push(ListFormsPage, {
                  placeName: this.placeName,
                  scheduleId: this.scheduleId,
                  placeId: this.placeId
                });
              }
              if (type === "audits") {
                this.navCtrl.push(ListRetailAuditFormPage, {
                  placeName: this.placeName,
                  scheduleId: this.scheduleId,
                  placeId: this.placeId
                });
              }
              if (type === "photo") {
                this.navCtrl.push(PhotoPage, {
                  placeName: this.placeName,
                  scheduleId: this.scheduleId,
                  placeId: this.placeId
                });
              }
              if (type === "note") {
                this.navCtrl.push(NotePage, {
                  placeName: this.placeName,
                  scheduleId: this.scheduleId,
                  placeId: this.placeId
                });
              }
              if (type === "orders") {
                this.navCtrl.push(ListProductPage, {
                  placeName: this.placeName,
                  scheduleId: this.scheduleId,
                  placeId: this.placeId
                });
              }
              this.startDay();
              this.addNotifications();
            }
          },
          {
            text: 'Proceed without check in',
            handler: () => {
            }
          },
          {
            text: 'Cancel',
            handler: () => {

            }
          }
        ]
      });
      confirm.present();
    } else {
      if (type === "form") {
        this.navCtrl.push(ListFormsPage, {
          placeName: this.placeName,
          scheduleId: this.scheduleId,
          placeId: this.placeId
        });
      }
      if (type === "audits") {
        this.navCtrl.push(ListRetailAuditFormPage, {
          placeName: this.placeName,
          scheduleId: this.scheduleId,
          placeId: this.placeId
        });
      }
      if (type === "photo") {
        this.navCtrl.push(PhotoPage, {
          placeName: this.placeName,
          scheduleId: this.scheduleId,
          placeId: this.placeId
        });
      }
      if (type === "note") {
        this.navCtrl.push(NotePage, {
          placeName: this.placeName,
          scheduleId: this.scheduleId,
          placeId: this.placeId
        });
      }
      if (type === "orders") {
        this.navCtrl.push(ListProductPage, {
          placeName: this.placeName,
          scheduleId: this.scheduleId,
          placeId: this.placeId
        });
      }
    }
  }

  checkOutVisit() {
    this.currentDist = this.computeMileage(this.currentLat, this.currentLng, parseFloat(this.lat), parseFloat(this.lng), "K");
    this.dataDtoIn.CheckOutDistance = this.currentDist.toFixed(2);
    this.scheduleRepoApi.checkOutVisit(this.dataDtoIn, this.repoId);
    this.cancelAllNotifications();
  }

  startDay() {
    //if(localStorage.getItem('lastMileageDate') === moment().format("YYYY-MM-DD").toString() 
    // if(localStorage.getItem('workStatus') === "stopped"
    // || localStorage.getItem('workStatus')==="started") {
    //     return;
    // }else{
    if (localStorage.getItem('workStatus') === "paused" 
    || localStorage.getItem('workStatus')===undefined
    || localStorage.getItem('workStatus')==="undefined"
    || localStorage.getItem('workStatus')===null
    || localStorage.getItem('workStatus')==="null"
    || (localStorage.getItem('workStatus')==="stopped" 
       && moment(localStorage.getItem('lastMileageDate')).isBefore(moment()))) {
      let alertConfirm = this.alertCtrl.create({
        title: '',
        message: 'Are you sure you want to start / resume your day ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.hideCheckOutButton = false;
              console.log('No clicked');
            }
          },
          {
            text: 'Start / Resume day',
            handler: () => {
              this.hideCheckOutButton = false;

              if(localStorage.getItem('workStatus')===null 
               || localStorage.getItem('workStatus')===undefined
               || localStorage.getItem('workStatus')==="undefined"
               || localStorage.getItem('workStatus')==="null") {
                let startTime = moment().format("YYYY-MM-DD HH:mm");
                localStorage.setItem('startTime', startTime);
              }
              localStorage.setItem('lastMileageDate', moment().format("YYYY-MM-DD"));
              localStorage.setItem('workStatus', "started");
              this.addTimerNotification();
            }
          }
        ]
      });
      alertConfirm.present();
    }
  }

}
