import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserRepoApi } from '../../repos/user-repo-api';
import { TimeMileageServiceApi } from '../../shared/shared';
import * as moment from 'moment';
import { DatePicker } from 'ionic2-date-picker';

@Component({
  selector: 'page-timemileage',
  templateUrl: 'timemileage.html',
  providers: [DatePicker]
})
export class TimeMileagePage {

  dateFrom: any;
  dateTo: any;
  dateSelected: any = "";
  repModel: any = "";
  reps: any[] = [];
  records: any[] = [];

  loader: any;

  constructor(private calendar: DatePicker,
    private userRepoApi: UserRepoApi,
    private loading: LoadingController,
    public timeMileageServiceApi: TimeMileageServiceApi,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.dateFrom = moment().format('YYYY-MM-DD').toString();
    this.dateTo = this.dateFrom;
    this.repModel = localStorage.getItem('userid');

    this.calendar.onDateSelected.subscribe((date) => {
      if (this.dateSelected === "from") {
        this.dateFrom = moment(date).format('YYYY-MM-DD').toString();
        this.listReport();
      } else {
        this.dateTo = moment(date).format('YYYY-MM-DD').toString();
        this.listReport();
      }
    });

    this.listReps();
    this.listReport();
  }

  showCalendar(dateSelectedVar) {
    this.dateSelected = dateSelectedVar;
    this.calendar.showCalendar();
  }

  listReport() {
    this.records = [];
    this.loader = this.loading.create({
      content: 'Busy, please wait. ..'
    });
    this.loader.present().then(() => {
      this.timeMileageServiceApi
        .getMileageRep(this.repModel, this.dateFrom, this.dateTo)
        .subscribe(
        res => {
          if(res.length > 0){
            for(var i=0;i<res.length;i++){
                this.records.push({
                   date : moment(res[i].dateCreated).format('MMMM Do YYYY'),
                   duration : res[i].duration,
                   mileage : parseFloat(res[i].mileage).toFixed(2)
                }); 
            }
          }
          this.loader.dismiss();
        }, err => {
          this.loader.dismiss();
          console.log(err);
          return;
        });
    });
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

  ionViewDidLoad() {

  }

}
