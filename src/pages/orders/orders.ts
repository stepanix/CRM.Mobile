import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';


@Component({
   selector: 'page-orders',
   templateUrl: 'orders.html',
})
export class OrdersPage {

  OrderModel : any;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  private signaturePadOptions: Object = {
      'minWidth': 3,
      'canvasWidth': 600,
      'canvasHeight': 100
  };

  constructor(private calendarDate:DatePicker,
     private calendarDueDate:DatePicker,
     public navCtrl: NavController,
     public navParams: NavParams) {
     this.OrderModel = {};

     this.calendarDate.onDateSelected
        .subscribe((date) => { 
          this.OrderModel.Date = moment(date).format('YYYY-MM-DD').toString(); 
     });

     this.calendarDueDate.onDateSelected
      .subscribe((date) => {
       this.OrderModel.DueDate = moment(date).format('YYYY-MM-DD').toString(); 
     });
  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 3);
    this.signaturePad.clear();
  }

  showCalendarDate() {
    this.calendarDate.showCalendar();
  }

  showCalendarDueDate() {
    this.calendarDueDate.showCalendar();
  }

  drawComplete() {
    this.OrderModel.Signature = this.signaturePad.toDataURL();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
