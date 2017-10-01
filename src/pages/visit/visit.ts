import { Component } from '@angular/core';
import { NavController, NavParams,AlertController  } from 'ionic-angular';
import * as moment from 'moment';
import { ListFormsPage } from '../listforms/listforms';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';
import { SchedulePage } from '../schedule/schedule';



@Component({
   selector: 'page-visit',
   templateUrl: 'visit.html',
})

export class VisitPage {

  scheduleId : any;
  placeId : any;
  placeName : any;
  streetAddress : any;
  lat : any;
  lng : any;
  dataDtoIn : any;
  hideCheckOutButton : boolean = true;

  constructor(private scheduleRepoApi : ScheduleRepoApi,
    public alertCtrl : AlertController,
    public navCtrl : NavController, public navParams : NavParams) {
    this.scheduleId = this.navParams.get('scheduleId');
    this.placeId = this.navParams.get('placeId');
    this.placeName = this.navParams.get('placeName');
    this.streetAddress = this.navParams.get('streetAddress');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
    this.getScheduleData();
  }

  ionViewDidLoad() {
     
  }

  getScheduleData() {
     this.scheduleRepoApi.listById(this.scheduleId).then((res) => {
         this.dataDtoIn = res.results[0];
         if(res.results.length > 0){
            if(this.dataDtoIn.VisitStatus === "In"){
              this.hideCheckOutButton = false;
            }else{
              this.hideCheckOutButton = true;
            }
         }else{
            this.hideCheckOutButton = true;
         }
     });
  }

  updateScheduleStatus() {
      this.dataDtoIn.CheckInTime = moment().format("YYYY-MM-DD HH:mm");
      this.dataDtoIn.VisitStatus = "In";
      this.dataDtoIn.IsSynched = 0;
      this.scheduleRepoApi.updateRecord(this.dataDtoIn);
  }

  checkIn(type) {
    if (this.dataDtoIn.VisitStatus !== "In") {
            let confirm = this.alertCtrl.create({
              title: 'Do you want to check in at ' + this.placeName + ' ?',       
              buttons: [
                {
                  text: 'Check in here',
                  handler: () => {
                      this.hideCheckOutButton = false;
                      this.updateScheduleStatus();
                      if(type==="form") {
                          this.navCtrl.push(ListFormsPage, {
                              scheduleId : this.scheduleId,
                              placeId : this.placeId
                          });
                      }
                  }
                },
                {
                  text: 'Proceed without check in',
                  handler: () => {
                    console.log('Agree clicked');
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
       }else{
            if(type==="form") {
                this.navCtrl.push(ListFormsPage, {
                    scheduleId : this.scheduleId,
                    placeId : this.placeId
                });
            }
       }
  }

  checkOutVisit() {
    this.scheduleRepoApi.checkOutVisit();
    this.navCtrl.setRoot(SchedulePage);
  }



}
