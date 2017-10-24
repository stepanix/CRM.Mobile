import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ActivityServiceApi} from '../../shared/shared';
import {UserRepoApi} from '../../repos/user-repo-api';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
  providers: [DatePicker]
})
export class SummaryPage {

  formsCount : any = 0;
  retailAuditCount : any = 0;
  photosCount : any = 0;
  placeNotesCount : any = 0;
  ordersCount : any = 0;

  dateFrom : any;
  dateTo : any;
  dateSelected : any = "";
  repModel : any = "";
  reps : any[] = [];

  constructor(private userRepoApi : UserRepoApi,
     private calendar: DatePicker,
    public activityServiceApi: ActivityServiceApi,
    public navCtrl: NavController,
    public navParams: NavParams) {

      this.dateFrom =  moment().format('YYYY-MM-DD').toString();
      this.dateTo = this.dateFrom;
      this.repModel = localStorage.getItem('userid');

      this.calendar.onDateSelected.subscribe((date) => {
          if (this.dateSelected==="from") {
              this.dateFrom = moment(date).format('YYYY-MM-DD').toString(); 
          } else {
              this.dateTo = moment(date).format('YYYY-MM-DD').toString(); 
          }
      });

      this.listReps();
  }

  showCalendar(dateSelectedVar){
    this.dateSelected = dateSelectedVar;
    this.calendar.showCalendar();
  }

  listReps(){
    this.reps = [];
    this.userRepoApi.list().then((res) => {
          for(var i = 0; i<res.results.length;i++) {
              this.reps.push({
                  id : res.results[i].Id,
                  name : res.results[i].FirstName + ' ' + res.results[i].Surname
              });
          }
      });
  }

  listSummary() {

  }

  ionViewDidLoad() {
    
  }


}
