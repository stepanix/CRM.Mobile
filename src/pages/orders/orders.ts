import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController,ToastController} from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import {OrderRepoApi} from '../../repos/order-repo-api';
import { OrderItemRepoApi } from '../../repos/orderitem-repo-api';

import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivitiesPage } from '../activities/activities';
import { ListProductPage } from '../listproduct/listproduct';

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
  price : any;
  taxableSubTotal : any = "0";
  orderId : any;
  OrderDto : any;
  operation : any = "save";
  totalItems : number = 0;
  isDisabled : boolean = false;
  loader: any;
  scheduleRepoId : any;
  orderRepoId : any;
  
  private signaturePadOptions : Object = {
      'minWidth': 3,
      'canvasWidth': 600,
      'canvasHeight': 100
  };

  constructor(private loading: LoadingController,
    private syncServiceApi: SyncServiceApi,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public orderItemRepoApi: OrderItemRepoApi,                            
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
      this.OrderModel.OrderDate = moment().format('YYYY-MM-DD').toString();
      this.OrderModel.DueDate = moment().format('YYYY-MM-DD').toString();
      
      this.placeName = this.navParams.get('placeName');
      this.scheduleId = this.navParams.get('scheduleId');
      this.placeId = this.navParams.get('placeId');
      this.orderId = this.navParams.get('orderId');
      this.totalItems = this.navParams.get('totalItems');
      
      if(this.orderId !== undefined) {
         this.getOrdersRepo();
      }

      this.calendar.onDateSelected.subscribe((date) => {
            if (this.dateSelected==="date") {
                this.OrderModel.OrderDate = moment(date).format('YYYY-MM-DD').toString(); 
            } else {
                this.OrderModel.DueDate = moment(date).format('YYYY-MM-DD').toString();
            }
      });
  }

  viewItemsRepo(){
    this.navCtrl.push(ListProductPage, {
      placeName: this.placeName,
      scheduleId: this.scheduleId,
      scheduleRepoId : this.scheduleRepoId,
      orderRepoId : this.orderRepoId,
      placeId: this.placeId
    });
  }

  getSheduleRepoId(){

  }

  submitOrder() {
    let alertConfirm = this.alertCtrl.create({
        title: '',
        message: 'Are you sure you want to submit this record ? you will not be able to make changes after submitting',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('No clicked');
                }
            },
            {
                text: 'Submit',
                handler: () => {
                    this.orderRepoApi.submit(this.scheduleId,this.orderId);
                    this.orderItemRepoApi.submit(this.orderId);
                    this.loader = this.loading.create({
                        content: 'Submitting, please wait...',
                    });
                    this.loader.present().then(() => {
                        this.syncServiceApi.downloadServerData();
                        this.navCtrl.setRoot(ActivitiesPage);
                        this.loader.dismiss();
                    });
                }
            }
        ]
    });
    alertConfirm.present();
}

  deleteOrder() {
    let alertConfirm = this.alertCtrl.create({
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.orderItemRepoApi.deleteOrderItems(this.orderId);
            this.orderRepoApi.deleteOrder(this.orderId);
            this.navCtrl.pop();
          }
        }
      ]
    });
    alertConfirm.present();
}

  getOrdersRepo() {
    this.orderRepoApi
    .listByOrderId(this.orderId)
    .then((res) => {
        if(res.results.length > 0){
          this.OrderModel.Quantity = res.results[0].Quantity;
          this.OrderModel.Amount = res.results[0].Amount;
          this.OrderModel.DiscountRate = res.results[0].DiscountRate;
          this.OrderModel.DiscountAmount = res.results[0].DiscountAmount;
          this.OrderModel.TaxRate = res.results[0].TaxRate;
          this.OrderModel.TaxAmount = res.results[0].TaxAmount;
          this.OrderModel.TotalAmount = res.results[0].TotalAmount;
          this.OrderModel.OrderDate = moment(res.results[0].OrderDate).format('YYYY-MM-DD').toString();
          this.OrderModel.DueDays = res.results[0].DueDays; 
          this.OrderModel.DueDate = moment(res.results[0].DueDate).format('YYYY-MM-DD').toString();
          this.OrderModel.Note = res.results[0].Note;
          this.OrderModel.Signature = res.results[0].Signature;
          this.signaturePad.fromDataURL(this.OrderModel.Signature);
          this.operation = "update";
           this.computeDiscountAmount();
           this.computeDiscountRate();
           this.computeTaxAmount();
           this.scheduleRepoId = res.results[0].ScheduleRepoId;
           this.orderRepoId = res.results[0].RepoId;
           if(res.results[0].Submitted===2){
             this.isDisabled = true;
           }
        }
     });
 }

  resetComputations() {
    this.OrderModel.DiscountRate = "0";
    this.OrderModel.DiscountAmount = "0";
    this.OrderModel.TaxRate = "0";
    this.OrderModel.TaxAmount = "0";
    this.OrderModel.TotalDiscountAmount = "0";
    this.OrderModel.TotalAmount = "0";
    this.taxableSubTotal = "0";
  }

  computeDiscountAmount() {
    this.OrderModel.DiscountAmount = parseFloat(((this.OrderModel.DiscountRate/100) * this.OrderModel.Amount).toString()).toFixed(2);
    this.taxableSubTotal = parseFloat((this.OrderModel.Amount - this.OrderModel.DiscountAmount).toString()).toFixed(2);
  }

  computeDiscountRate() {
    this.OrderModel.DiscountRate = parseFloat(((this.OrderModel.DiscountAmount/this.OrderModel.Amount) * 100).toString()).toFixed(2);
    this.taxableSubTotal = parseFloat((this.OrderModel.Amount - this.OrderModel.DiscountAmount).toString()).toFixed(2);  
  }

  computeTaxAmount() {
    this.OrderModel.TaxAmount = parseFloat(((this.OrderModel.TaxRate/100) * this.taxableSubTotal).toString()).toFixed(2);
    this.OrderModel.TotalDiscountAmount = this.OrderModel.DiscountAmount;
    this.OrderModel.TotalAmount =  parseFloat((parseFloat(this.OrderModel.TaxAmount) + parseFloat(this.taxableSubTotal)).toString()).toFixed(2);
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

  prepareOrderDto() {
      if(this.operation === "save") {
         this.orderId = this.newGuid();
      }
      this.OrderDto = {
        Id: this.orderId,
        ServerId: 0,
        PlaceId: this.placeId,
        ScheduleId: this.scheduleId,
        Quantity: this.OrderModel.Quantity,
        Amount: this.OrderModel.Amount,
        DiscountRate: this.OrderModel.DiscountRate,
        DiscountAmount: this.OrderModel.DiscountAmount,
        TaxRate: this.OrderModel.TaxRate,
        TaxAmount: this.OrderModel.TaxAmount,
        TotalAmount: this.OrderModel.TotalAmount,
        OrderDate: this.OrderModel.OrderDate,
        DueDays: this.OrderModel.DueDays,
        DueDate: this.OrderModel.DueDate,
        Note: this.OrderModel.Note,
        Signature: this.OrderModel.Signature,
        IsSynched: 0
    };
  }

  saveOrderRepo() {
      this.prepareOrderDto();
      if(this.operation === "save") {
         this.orderRepoApi.insertRecord(this.OrderDto);
      }else{
         this.orderRepoApi.updateRecord(this.OrderDto);
      }
      this.navCtrl.pop();
  }
  

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 3);
    this.signaturePad.clear();
  }

  clearSignature() {
    this.signaturePad.clear();
    this.OrderModel.Signature = "";
  }

  showCalendarDate() {
    if(this.isDisabled===true){
      return;
    }
    this.dateSelected="date";
    this.calendar.showCalendar();
  }

  showCalendarDueDate() {
    if(this.isDisabled===true){
      return;
    }
    this.dateSelected="dueDate";
    this.calendar.showCalendar();
  }

  drawStart() {
  }

  drawComplete() {
    this.OrderModel.Signature = this.signaturePad.toDataURL();
  }

  ionViewDidLoad() {    
  }

}
