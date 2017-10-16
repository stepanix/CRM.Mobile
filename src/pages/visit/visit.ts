import { Component } from '@angular/core';
import { NavController, NavParams,AlertController  } from 'ionic-angular';
import * as moment from 'moment';
import { ListFormsPage } from '../listforms/listforms';
import { ListRetailAuditFormPage } from '../listretailauditform/listretailauditform';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';
import { SchedulePage } from '../schedule/schedule';
import { PhotoPage } from '../photo/photo';
import { NotePage } from '../note/note';

import {ActivityRepoApi} from '../../repos/activity-repo-api';

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
  dataDtoIn : any = {};
  hideCheckOutButton : boolean = true;
  visitStatus = "";
  repoId : any;
  
  constructor(
    private scheduleRepoApi : ScheduleRepoApi,
    public alertCtrl : AlertController,
    public navCtrl : NavController, 
    public navParams : NavParams) {
    
  }

  ionViewDidLoad(){
  }

  ionViewWillEnter(){
      this.scheduleId = this.navParams.get('scheduleId');
      this.placeId = this.navParams.get('placeId');
      this.placeName = this.navParams.get('placeName');
      this.streetAddress = this.navParams.get('streetAddress');
      this.lat = this.navParams.get('lat');
      this.lng = this.navParams.get('lng');
      this.getScheduleData();
  }

  getScheduleData() {   
     this.scheduleRepoApi.listById(this.scheduleId).then((res) => {
         if(res.results.length > 0){
            this.dataDtoIn = res.results[0];
            if(this.dataDtoIn.VisitStatus === "In"){
              this.visitStatus = this.dataDtoIn.VisitStatus;
              this.hideCheckOutButton = false;
            }else{
              this.hideCheckOutButton = true;
            }
         }else{
            this.dataDtoIn.ServerId = 0;
            this.visitStatus = "";
            this.hideCheckOutButton = true;
         }
     });
  }

  enterSchedule(){
    if(this.dataDtoIn.ServerId === 0){
      this.createNewSchedule();
    }else{
      this.updateScheduleStatus();
    }
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
            RepoId : this.scheduleId,
            ServerId :  0,
            PlaceId: this.placeId,
            PlaceName : this.placeName,
            PlaceAddress : this.parseStreetAddress(this.streetAddress),
            UserId: localStorage.getItem('userid'),
            VisitDate: moment().format("YYYY-MM-DD") + "T00:00:00",
            VisitTime: moment().format("YYYY-MM-DD HH:mm"),
            CheckInTime : moment().format("YYYY-MM-DD HH:mm"),
            VisitNote: "",
            IsRecurring: false,
            RepeatCycle: 0,
            IsScheduled: false,
            IsVisited: true,
            IsMissed: false,
            IsUnScheduled: true,
            VisitStatus: 'In',
            IsSynched: 0
      };
      console.log(JSON.stringify(ScheduleDto));
      this.scheduleRepoApi.insertRecord(ScheduleDto);
  }

  parseStreetAddress(address){
    if(address===undefined){
      return "";
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
                      if(type==="form") {
                          this.navCtrl.push(ListFormsPage, {
                              placeName : this.placeName,
                              scheduleId : this.scheduleId,
                              placeId : this.placeId
                          });
                      }
                      if(type==="audits") {
                        this.navCtrl.push(ListRetailAuditFormPage, {
                            placeName : this.placeName,
                            scheduleId : this.scheduleId,
                            placeId : this.placeId
                        });
                      }
                      if(type==="photo") {
                          this.navCtrl.push(PhotoPage, {
                            placeName : this.placeName,
                            scheduleId : this.scheduleId,
                            placeId : this.placeId
                        });
                      }
                      if(type==="note") {
                        this.navCtrl.push(NotePage, {
                          placeName : this.placeName,
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
                    placeName : this.placeName,
                    scheduleId : this.scheduleId,
                    placeId : this.placeId
                });
            }
            if(type==="audits") {
              this.navCtrl.push(ListRetailAuditFormPage, {
                  placeName : this.placeName,
                  scheduleId : this.scheduleId,
                  placeId : this.placeId
              });
            }
            if(type==="photo") {
              this.navCtrl.push(PhotoPage, {
                  placeName : this.placeName,
                  scheduleId : this.scheduleId,
                  placeId : this.placeId
            });
          }
          if(type==="note") {
             this.navCtrl.push(NotePage, {
                 placeName : this.placeName,
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
