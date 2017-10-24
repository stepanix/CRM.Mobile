import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import {OrderRepoApi} from '../../repos/order-repo-api';
import {ActivityRepoApi} from '../../repos/activity-repo-api';


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
  price : any;
  taxableSubTotal : any = "0";
  orderId : any;

  private signaturePadOptions : Object = {
      'minWidth': 3,
      'canvasWidth': 600,
      'canvasHeight': 100
  };

  constructor(private activityRepoApi : ActivityRepoApi,
              private orderRepoApi : OrderRepoApi,
              private calendar : DatePicker,
              public navCtrl : NavController,
              public navParams : NavParams) {

      this.OrderModel = {};
      this.OrderModel.Quantity = "0";
      this.OrderModel.Amount = "0";
      this.OrderModel.DiscountRate = "0";
      this.OrderModel.DiscountAmount = "0";
      this.OrderModel.TaxRate = "0";
      this.OrderModel.TaxAmount = "0";
      this.OrderModel.DueDays = "0";
      this.OrderModel.Signature = "";
      this.OrderModel.Date = moment().format('YYYY-MM-DD').toString();
      this.OrderModel.DueDate = moment().format('YYYY-MM-DD').toString();

      this.price = parseFloat(this.navParams.get('price'));
      this.productId = this.navParams.get('productId');
      this.productName = this.navParams.get('productName');
      this.placeName = this.navParams.get('placeName');
      this.scheduleId = this.navParams.get('scheduleId');
      this.placeId = this.navParams.get('placeId');

      this.calendar.onDateSelected.subscribe((date) => {
            if (this.dateSelected==="date") {
                this.OrderModel.Date = moment(date).format('YYYY-MM-DD').toString(); 
            } else {
                this.OrderModel.DueDate = moment(date).format('YYYY-MM-DD').toString(); 
            }
      });
  }

  computeAmount() {
    this.OrderModel.Amount = this.OrderModel.Quantity * this.price;
    this.taxableSubTotal = this.OrderModel.Amount;
    this.OrderModel.TotalAmount = this.taxableSubTotal;
  }

  computeDiscountAmount() {
    this.OrderModel.DiscountAmount = (this.OrderModel.DiscountRate/100) * this.OrderModel.Amount;
    this.taxableSubTotal = this.OrderModel.Amount - this.OrderModel.DiscountAmount;
    this.OrderModel.TotalAmount = this.taxableSubTotal;
  }

  computeDiscountRate() {
    this.OrderModel.DiscountRate = (this.OrderModel.DiscountAmount/this.OrderModel.Amount) * 100;
    this.taxableSubTotal = this.OrderModel.Amount - this.OrderModel.DiscountAmount;    
  }

  computeTaxAmount() {
    this.OrderModel.TaxAmount = (this.OrderModel.TaxRate/100) * this.taxableSubTotal;
    this.OrderModel.TotalDiscountAmount = this.OrderModel.DiscountAmount;
    this.OrderModel.TotalAmount =  this.OrderModel.TaxAmount + this.taxableSubTotal;
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

  saveOrderRepo() {
        this.orderId = this.newGuid();
        let OrderDto = {
          Id: this.orderId,
          ServerId: 0,
          PlaceId: this.placeId,
          ScheduleId: this.scheduleId,
          ProductId: this.productId,
          Quantity: this.OrderModel.Quantity,
          Amount: this.OrderModel.Amount,
          DiscountRate: this.OrderModel.DiscountRate,
          DiscountAmount: this.OrderModel.DiscountAmount,
          TaxRate: this.OrderModel.TaxRate,
          TaxAmount: this.OrderModel.TaxAmount,
          TotalAmount: this.OrderModel.TotalAmount,
          OrderDate: this.OrderModel.Date,
          DueDays: this.OrderModel.DueDays,
          DueDate: this.OrderModel.DueDate,
          Note: this.OrderModel.Note,
          Signature: this.OrderModel.Signature,
          IsSynched: 0
      };
      this.orderRepoApi.insertRecord(OrderDto);
      this.logActivityRepo();
      this.navCtrl.pop();
  }

  logActivityRepo() {
    let ActivityDtoIn = {
       Id: this.newGuid(),
       PlaceName : this.placeName,
       PlaceId: this.placeId,
       ActivityLog: 'Orders',
       ActivityTypeId : this.orderId,
       IsSynched: 0,
       DateCreated : moment().format().toString()
    }
    this.activityRepoApi.insertRecord(ActivityDtoIn);
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

  drawStart() {
  }

  drawComplete() {
    this.OrderModel.Signature = this.signaturePad.toDataURL();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
