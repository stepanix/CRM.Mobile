import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import {OrderRepoApi} from '../../repos/order-repo-api';


@Component({
   selector: 'page-orders',
   templateUrl: 'orders.html',
   providers: [DatePicker]
})
export class OrdersPage {

  OrderModel : any;
  dateSelected : string="";
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  scheduleId : any;
  placeId : any;
  placeName : string;
  productId : any;
  productName : any;

  private signaturePadOptions : Object = {
      'minWidth': 3,
      'canvasWidth': 600,
      'canvasHeight': 100
  };

  constructor(private orderRepoApi : OrderRepoApi,
              private calendar:DatePicker,
              public navCtrl: NavController,
              public navParams: NavParams) {

      this.OrderModel = {};

      this.productId = this.navParams.get('productId');
      this.productName = this.navParams.get('productName');
      this.placeName = this.navParams.get('placeName');
      this.scheduleId = this.navParams.get('scheduleId');
      this.placeId = this.navParams.get('placeId');

      this.calendar.onDateSelected
          .subscribe((date) => { 
            if(this.dateSelected==="date") {
              this.OrderModel.Date = moment(date).format('YYYY-MM-DD').toString(); 
            }else{
              this.OrderModel.DueDate = moment(date).format('YYYY-MM-DD').toString(); 
            }
      });
  }

  saveOrderRepo() {

  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 3);
    this.signaturePad.clear();
  }

  showCalendarDate() {
    this.dateSelected="date";
    this.calendar.showCalendar();
  }

  showCalendarDueDate() {
    this.dateSelected="dueDate";
    this.calendar.showCalendar();
  }

  drawComplete() {
    this.OrderModel.Signature = this.signaturePad.toDataURL();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
