import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { UserRepoApi } from '../../repos/user-repo-api';
import { PlaceRepoApi } from '../../repos/place-repo-api';

import * as moment from 'moment';
import { DatePicker } from 'ionic2-date-picker';

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
  providers: [DatePicker,UserRepoApi,PlaceRepoApi]
})
export class FilterPage {

  dateFrom: any;
  dateTo: any;
  dateSelected: any = "";
  repModel: any = "";
  placeModel : any = "0";
  reps: any[] = [];  
  places: any[] = []; 
  selectedModule : any = "";

  filterModule : any = {};

  constructor(public viewCtrl: ViewController,
    private placeRepoApi: PlaceRepoApi,
    private calendar: DatePicker,
    private userRepoApi: UserRepoApi,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      this.dateFrom = moment().format('YYYY-MM-DD').toString();
      this.dateTo = this.dateFrom;
      this.repModel = localStorage.getItem('userid');
      this.placeModel = "-1";
      this.selectedModule = "all";

      this.calendar.onDateSelected.subscribe((date) => {
        if (this.dateSelected === "from") {
          this.dateFrom = moment(date).format('YYYY-MM-DD').toString();          
        } else {
          this.dateTo = moment(date).format('YYYY-MM-DD').toString();
        }
      });

      this.listReps();
      this.listPlaceRepo();
  }

  showCalendar(dateSelectedVar) {
    this.dateSelected = dateSelectedVar;
    this.calendar.showCalendar();
  } 
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }

  listReps() {
    this.reps = [];
    this.userRepoApi.list().then((res) => {
      for (var i = 0; i < res.results.length; i++) {
        this.reps.push({
          id: res.results[i].Id,
          name: res.results[i].FirstName + ' ' + res.results[i].Surname
        });
      }
    });
  }

  listPlaceRepo() {
    this.places = [];
    this.placeRepoApi
      .getPlaceForActivity()
      .then((res) => {
        if (res.results.length > 0) {
          this.places = res.results;
        }
      });
  }

  close(){
    this.filterModule.dateFrom = this.dateFrom;
    this.filterModule.dateTo = this.dateTo;
    this.filterModule.repModel = this.repModel;
    this.filterModule.placeModel = this.placeModel;
    this.filterModule.selectedModule = this.selectedModule;
    this.viewCtrl.dismiss(this.filterModule);
  }

}
