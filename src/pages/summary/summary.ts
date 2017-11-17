import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ActivityServiceApi, ScheduleServiceApi, OrderServiceApi } from '../../shared/shared';
import { UserRepoApi } from '../../repos/user-repo-api';
import { PlaceRepoApi } from '../../repos/place-repo-api';
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

  totalVisitsCount: any = 0;
  scheduledCount: any = 0;
  visitedCount: any = 0;
  unscheduledCount: any = 0;
  missedCount: any = 0;

  ordersTotal: any = 0;

  dateFrom: any;
  dateTo: any;
  dateSelected: any = "";
  repModel: any = "";
  placeModel: any = "";
  reps: any[] = [];
  places: any[] = [];

  loader: any;

  constructor(private placeRepoApi: PlaceRepoApi,
    private orderServiceApi: OrderServiceApi,
    private loading: LoadingController,
    private scheduleServiceApi: ScheduleServiceApi,
    private userRepoApi: UserRepoApi,
    private calendar: DatePicker,
    public activityServiceApi: ActivityServiceApi,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.dateFrom = moment().format('YYYY-MM-DD').toString();
    this.dateTo = this.dateFrom;
    this.repModel = localStorage.getItem('userid');
    this.placeModel = "1";
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
    //this.listPlaces();
    //this.listSummary();
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
      this.listPlaces();
    });
  }

  listPlaces() {
    this.places = [];
    this.placeRepoApi.list().then((res) => {
      for (var i = 0; i < res.results.length; i++) {
        this.places.push({
          id: res.results[i].ServerId,
          name: res.results[i].Name
        });
        this.placeModel = res.results[0].ServerId;
      }
      this.listSummary();
    });
  }

  listSummary() {
    this.loader = this.loading.create({
      content: 'Busy, please wait. ..',
    });
    this.loader.present().then(() => {
      this.activityServiceApi
        .getActivitiesSummary(this.repModel, this.dateFrom, this.dateTo, this.placeModel)
        .subscribe(
        res => {
          this.formsCount = res.formCount;
          this.placeNotesCount = res.noteCount;
          this.retailAuditCount = res.retailAuditCount;
          this.ordersCount = res.orderCount;
          this.photosCount = res.photoCount;
          this.ordersTotal = res.orderTotal;
          this.totalVisitsCount =  res.totalVisitCount;
          this.scheduledCount =  res.scheduledVisitCount;
          this.visitedCount =  res.visitCount;
          this.unscheduledCount =  res.unScheduledVisitCount;
          this.missedCount =  res.missedVisitCount;
          this.loader.dismiss();
        }, err => {
          this.loader.dismiss();
          console.log(err);
          return;
        });
    });
  }

  ionViewDidLoad() {

  }


}
