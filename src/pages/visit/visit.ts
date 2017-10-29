import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  hideCheckOutButton: boolean = true;
  visitStatus = "";
  repoId: any;
  activities: any[] = [];

  constructor(private localNotifications: LocalNotifications,
    private activityRepoApi: ActivityRepoApi,
    private scheduleRepoApi: ScheduleRepoApi,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.repoId = this.navParams.get('repoId');
    this.scheduleId = this.navParams.get('scheduleId');
    this.placeId = this.navParams.get('placeId');
    this.placeName = this.navParams.get('placeName');
    this.streetAddress = this.navParams.get('streetAddress');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
    this.getScheduleData();
    this.getActivityRepo();
    console.log("street address", this.streetAddress);
  }

  getActivityRepo() {
    this.activities = [];
    this.activityRepoApi.list().then((res) => {
      for (var i = 0; i < res.results.length; i++) {
        this.activities.push({
          PlaceName: res.results[i].PlaceName,
          ActivityTypeId: res.results[i].ActivityTypeId,
          ActivityLog: res.results[i].ActivityLog,
          DateCreated: moment(res.results[i].DateCreated).format("lll")
        });
      }
    });
  }

  navigatePage(type, logId) {
    if (type === "Forms") {
      this.navCtrl.push(FormPage, {
        Id: logId,
        placeName: this.placeName,
        scheduleId: this.scheduleId,
        placeId: this.placeId
      });
    }
    if (type === "Product Retail Audit") {
      this.navCtrl.push(RetailAuditFormPage, {
        Id: logId,
        placeName: this.placeName,
        scheduleId: this.scheduleId,
        placeId: this.placeId
      });
    }
    if (type === "Photos") {
      this.navCtrl.push(PhotoPage, {
        Id: logId,
        placeName: this.placeName,
        scheduleId: this.scheduleId,
        placeId: this.placeId
      });
    }
    if (type === "Notes") {
      this.navCtrl.push(NotePage, {
        Id: logId,
        placeName: this.placeName,
        scheduleId: this.scheduleId,
        placeId: this.placeId
      });
    }
    if (type === "Orders") {
      this.navCtrl.push(OrdersPage, {
        Id: logId,
        placeName: this.placeName,
        scheduleId: this.scheduleId,
        placeId: this.placeId
      });
    }
  }

  getScheduleData() {
    this.scheduleRepoApi.listByScheduleId(this.repoId).then((res) => {
      console.log(JSON.stringify(res.results));
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
    if (this.dataDtoIn.RepoId === undefined) {
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
  }

  addNotifications() {
      let checkedInData = {
        repoId : this.repoId,
        scheduleId : this.scheduleId,
        placeId : this.placeId,
        placeName : this.placeName,
        streetAddress : this.streetAddress,
        lat : this.lat,
        lng : this.lng
      }

      this.localNotifications.schedule({
        id: 1,
        title: 'Checked in at ' + this.placeName,
        ongoing: true,
        data : checkedInData,
        every: 'second',
        sound : null
      });
  }

  cancelAllNotifications() {
    this.localNotifications.cancelAll();
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
    this.dataDtoIn.CheckInTime = moment().format("YYYY-MM-DD HH:mm");
    this.dataDtoIn.VisitStatus = "In";
    this.dataDtoIn.IsSynched = 0;
    this.scheduleRepoApi.checkInVisit(this.dataDtoIn);
  }

  createNewSchedule() {
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
    console.log(JSON.stringify(ScheduleDto));
    this.scheduleRepoApi.insertRecord(ScheduleDto);
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
            }
          },
          {
            text: 'Proceed without check in',
            handler: () => {
              // console.log('Agree clicked');
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
    this.scheduleRepoApi.checkOutVisit(this.dataDtoIn);
    this.cancelAllNotifications();
  }

}
