import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ActivityServiceApi,ScheduleServiceApi,OrderServiceApi } from '../../shared/shared';
import { UserRepoApi } from '../../repos/user-repo-api';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
  providers: [DatePicker]
})
export class SummaryPage {

  formsCount: any = 0;
  retailAuditCount: any = 0;
  photosCount: any = 0;
  placeNotesCount: any = 0;
  ordersCount: any = 0;

  totalVisitsCount : any = 0;
  scheduledCount : any = 0;
  visitedCount : any = 0;
  unscheduledCount : any = 0;
  missedCount : any = 0;

  ordersTotal : any = 0;

  dateFrom: any;
  dateTo: any;
  dateSelected: any = "";
  repModel: any = "";
  reps: any[] = [];
  
  loader: any;

  constructor(private orderServiceApi : OrderServiceApi,
    private loading: LoadingController,
    private scheduleServiceApi : ScheduleServiceApi,
    private userRepoApi: UserRepoApi,
    private calendar: DatePicker,
    public activityServiceApi: ActivityServiceApi,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.dateFrom = moment().format('YYYY-MM-DD').toString();
    this.dateTo = this.dateFrom;
    this.repModel = localStorage.getItem('userid');

    this.calendar.onDateSelected.subscribe((date) => {
        if (this.dateSelected === "from") {
           this.dateFrom = moment(date).format('YYYY-MM-DD').toString();
           this.listSummary();
        } else {
           this.dateTo = moment(date).format('YYYY-MM-DD').toString();
           this.listSummary();
        }
    });
    
    this.listReps();
    this.listSummary();
  }

  showCalendar(dateSelectedVar) {
    this.dateSelected = dateSelectedVar;
    this.calendar.showCalendar();
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

  listSummary() {
    this.loader = this.loading.create({
      content: 'Busy, please wait. ..',
    });
    this.loader.present().then(() => {      
      this.activityServiceApi
        .getActivitiesSummary(this.repModel, this.dateFrom, this.dateTo)
        .subscribe(
        res => {
          for (var i = 0; i < res.length; i++) {
            if (res[i].activityLog === "Forms") {
              this.formsCount += 1;
            }
            if (res[i].activityLog === "Notes") {
              this.placeNotesCount += 1;
            }
            if (res[i].activityLog === "Product Retail Audit") {
              this.retailAuditCount += 1;
            }
            if (res[i].activityLog === "Orders") {
              this.ordersCount += 1;
            }
            if (res[i].activityLog === "Photos") {
              this.photosCount += 1;
            }            
          }
          this.listScheduleSummary();
        }, err => {
          this.loader.dismiss();
          console.log(err);
          return;
        });
    });
  }

  listScheduleSummary(){
    this.scheduleServiceApi
    .getScheduleSummary(this.repModel, this.dateFrom, this.dateTo)
    .subscribe(
    res => {
      for (var i = 0; i < res.length; i++) {
        if (res[i].isVisited === true) {
          this.totalVisitsCount += 1;
        }
        if (res[i].isScheduled === true) {
          this.scheduledCount += 1;
        }
        if (res[i].isVisited === true && res[i].isScheduled === true) {
          this.visitedCount += 1;
        }
        if (res[i].isUnscheduled === true) {
          this.unscheduledCount += 1;
        }
        if (res[i].visitStatus === "New Visit" && moment(res[i].visitDate).isBefore(moment(new Date().toISOString()).format('YYYY-MM-DD').toString())) {
          this.missedCount += 1;
        }
      }
      this.getOrderTotal()
    }, err => {
      this.loader.dismiss();
      console.log(err);
      return;
    });
  }

  getOrderTotal() {
    this.orderServiceApi
    .getOrderSummary(this.repModel, this.dateFrom, this.dateTo)
    .subscribe(
    res => {
      for (var i = 0; i < res.length; i++) {
        this.ordersTotal += parseFloat(res[i].totalAmount);
      }
      this.loader.dismiss();
    }, err => {
       this.loader.dismiss();
       console.log(err);
       return;
    });
  }



  ionViewDidLoad() {

  }


}
