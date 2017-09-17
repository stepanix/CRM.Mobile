import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import {AutoCompleteComponent} from 'ionic2-auto-complete';
import {AutoCompleteService} from 'ionic2-auto-complete';
import {ScheduleServiceApi} from '../../shared/shared';
import {RepsAutoCompleteService} from '../../services/reps-autocomplete-service-api';
import {PlacesAutoCompleteService} from '../../services/place-autocomplete-service-api';



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

  constructor(private placeService:PlacesAutoCompleteService,
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
  }

  ionViewDidLoad() {
   
  }

  setSelectedUser(selecteduser) {
    alert(selecteduser);
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
        return true;
     }
  }

  saveScheduleApi() {
    
  }

  saveSchedule() {

  }

}
