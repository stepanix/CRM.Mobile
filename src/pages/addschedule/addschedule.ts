import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import {AutoCompleteComponent} from 'ionic2-auto-complete';
import {AutoCompleteService} from 'ionic2-auto-complete';
import {ScheduleServiceApi} from '../../shared/shared';
import {RepsAutoCompleteService} from '../../services/reps-autocomplete-service-api';
import {PlacesAutoCompleteService} from '../../services/place-autocomplete-service-api';

import {ScheduleRepoApi} from '../../repos/schedule-repo-api';
import { SchedulePage } from '../schedule/schedule';

@Component({
    selector: 'page-addschedule',
    templateUrl: 'addschedule.html',
    providers: [DatePicker]
})

export class AddSchedulePage {
  
  @ViewChild('searchrep')
  searchrep: AutoCompleteComponent;

  @ViewChild('searchplace')
  searchplace: AutoCompleteComponent;

  selectedDate : any = "Select date";
  selectedTime : any = "";
  ScheduleModel : any;
  selectedUser: any = {};
  selectedPlace : any = {};
  dtoUserId = "";
  dtoPlaceId = "";
  users : any[] = [];
  Recurring : boolean = false;
  Weeks : any = 0;
  Note : any = "";
  loader : any;
  streetAddress : any = "";

  constructor(
    private loading: LoadingController,
    private scheduleServiceRepo:ScheduleRepoApi,
    private placeService:PlacesAutoCompleteService,
    private repsService:RepsAutoCompleteService,
    private scheduleServiceApi: ScheduleServiceApi,
    private navCtrl:NavController, 
    private navParams:NavParams,
    private datePicker:DatePicker) {
      this.datePicker.onDateSelected.subscribe((date) => { this.selectedDate = moment(date).format('YYYY-MM-DD').toString(); });
      this.selectedTime = "";
      this.ScheduleModel = {};
      this.selectedTime = "";
      this.selectedUser.id = "";
      this.selectedPlace.id = "";
      this.dtoUserId = "";
      this.dtoPlaceId = "";
      this.streetAddress = "";
  }

  ionViewDidLoad() {
   
  }

  

  showCalendar() {
    this.datePicker.showCalendar();
  }
  
  checkAutoCompleteInputsSelected() :boolean {
     let selectedPlace = this.searchplace.getSelection();
     let selectedRep = this.searchrep.getSelection();
     if(selectedRep===undefined || selectedPlace===undefined || selectedRep==="undefined" || selectedPlace==="undefined"){
        return false;
     }else{
        this.dtoPlaceId = selectedPlace.id;
        this.dtoUserId = selectedRep.id;
        this.streetAddress = selectedPlace.streetAddress;
        return true;
     }
  }

  saveScheduleApi() {
        this.loader = this.loading.create({
            content: 'Busy please wait...',
        });
        this.loader.present().then(() => {
              let ScheduleDto = {
                id: 1,
                placeId: this.dtoPlaceId,
                userId: this.dtoUserId,
                visitDate: this.selectedDate,
                visitTime: this.selectedTime,
                visitNote: this.Note,
                isRecurring: this.Recurring,
                repeatCycle: this.Weeks,
                isVisited: false,
                isScheduled: true,
                isMissed : false,
                isUnScheduled: false,
                visitStatus : "New visit"
            };
            //console.log(JSON.stringify(ScheduleDto));
            this.scheduleServiceApi.addSchedule(ScheduleDto)
            .subscribe(
                res => {
                  this.loader.dismiss();
                  this.navCtrl.setRoot(SchedulePage);
                },err => {
                  console.log(err);
                  this.loader.dismiss();
                  return;
              });
      });
    
  }

  saveScheduleRepo() {
        this.loader = this.loading.create({
          content: 'Busy please wait...',
        });
        this.loader.present().then(() => {
              let ScheduleDto = {
                Id: this.newGuid(),
                RepoId : this.newGuid(),
                ServerId :  0,
                PlaceId: this.dtoPlaceId,
                PlaceName : this.searchplace.getSelection().name,
                PlaceAddress : this.searchplace.getSelection().streetAddress,
                UserId: this.dtoUserId,
                VisitDate: this.selectedDate + "T00:00:00",
                VisitTime: this.selectedDate + "T" + this.selectedTime,
                VisitNote: this.Note,
                IsRecurring: this.Recurring,
                RepeatCycle: this.Weeks,
                IsScheduled: true,
                IsVisited: false,
                IsMissed: false,
                IsUnScheduled: false,
                VisitStatus: 'New Visit',
                IsSynched: 0
            };
            this.scheduleServiceRepo.insertRecord(ScheduleDto);
            this.loader.dismiss();
            this.navCtrl.setRoot(SchedulePage);
      });
  }

  saveSchedule() {
     if(localStorage.getItem("isOnline")==="true"){
        this.saveScheduleApi();
     }else{
        this.saveScheduleRepo();
     }
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
