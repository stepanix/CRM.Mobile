import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductRepoApi } from '../../repos/product-repo-api';
import { OrderRepoApi } from '../../repos/order-repo-api';
import { OrdersPage } from '../orders/orders';
import { OrderItemPage } from '../orderitem/orderitem';
import * as moment from 'moment';


@Component({
  selector: 'page-listproduct',
  templateUrl: 'listproduct.html',
})
export class ListProductPage {

  products: any[] = [];
  scheduleId: any;
  placeId: any;
  placeName: string;
  valueOfItemsOrdered: number = 0;
  totalItems: number = 0;
  orderModel: any[] = [];
  orderItemModel: any = {};
  orderId : any;

  constructor(public orderRepoApi: OrderRepoApi,
    public productRepoApi: ProductRepoApi,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.placeName = this.navParams.get('placeName');
    this.scheduleId = this.navParams.get('scheduleId');
    this.placeId = this.navParams.get('placeId');
    this.getProductRepo();
    this.getOrderRepo();
  }

  ionViewDidLoad() {

  }

  getOrderRepo() {
    this.orderRepoApi.listByScheduleId(this.scheduleId).then((res) => {      
      if (res.results.length > 0) {
        for (let i = 0; i < res.results.length; i++) {
          this.orderId = res.results[0].Id;
          // this.orderModel.push({
          //   Id: res.results[i].Id,
          //   Quantity: res.results[i].Quantity,
          //   DiscountRate: res.results[i].DiscountRate,
          //   DiscountAmount: res.results[i].DiscountAmount,
          //   TaxRate: res.results[i].TaxRate,
          //   TaxAmount: res.results[i].TaxAmount,
          //   TotalAmount: res.results[i].TotalAmount,
          //   Amount: res.results[i].Amount,
          //   OrderDate: res.results[i].OrderDate,
          //   DueDate: res.results[i].DueDate,
          //   DueDays: res.results[i].DueDays,
          //   ServerId: 0,
          //   PlaceId: res.results[i].PlaceId,
          //   ScheduleId: res.results[i].ScheduleId,
          //   Note: res.results[i].Note,
          //   Signature: res.results[i].Signature,
          //   IsSynched: 0
          // });
          // this.totalItems += res.results[i].Quantity;
        }
      }else{
        this.createNewOrder();
        //this.totalItems =  1;
      }
    });
  }
  
  createNewOrder(){
    this.orderId = this.newGuid();
    let NewOrderModel = {
      Id : this.orderId,
      PlaceId : this.placeId,
      ScheduleId : this.scheduleId,
      ServerId : 0,
      Quantity : 0,
      Amount: "0",
      DiscountRate : "0",
      DiscountAmount : "0",
      TaxRate : "0",
      TaxAmount :  "0",
      TotalAmount : "0",
      OrderDate : moment().format('YYYY-MM-DD').toString(),
      DueDays : "0",
      DueDate : moment().format('YYYY-MM-DD').toString(),
      Note : "",
      Signature : "",
      IsSynched : 0
    }
    this.orderRepoApi.insertRecord(NewOrderModel);
  }

  addQty(item) {
    this.orderItemModel = this.orderModel.find(x => x.ProductId === item.id);
    if (this.orderItemModel === undefined) {
      this.orderItemModel = {};
      this.orderItemModel.Id = this.newGuid();
      this.orderItemModel.Quantity = 1;
      this.orderItemModel.DiscountRate = 0;
      this.orderItemModel.DiscountAmount = 0;
      this.orderItemModel.TaxRate = 0;
      this.orderItemModel.TaxAmount = 0;
      this.orderItemModel.TotalAmount = item.price;
      this.orderItemModel.Amount = item.price;
      this.orderItemModel.OrderDate = moment().format('YYYY-MM-DD').toString();
      this.orderItemModel.DueDate = moment().format('YYYY-MM-DD').toString();
      this.orderItemModel.DueDays = 0;
      this.orderItemModel.ServerId = 0;
      this.orderItemModel.PlaceId = this.placeId;
      this.orderItemModel.ScheduleId = this.scheduleId;
      this.orderItemModel.Note = "";
      this.orderItemModel.Signature = "";
      this.orderItemModel.IsSynched = 0;
      this.valueOfItemsOrdered = item.price;
      this.orderRepoApi.insertRecord(this.orderItemModel);
      this.getOrderRepo();
    }else{
      this.orderItemModel.Quantity += 1;
      this.orderRepoApi.updateRecord(this.orderItemModel);
      this.getOrderRepo();
    }
  }

  removeQty() {

  }

  newGuid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  getProductRepo() {
    this.products = [];
    this.productRepoApi.list().then((res) => {
      for (var i = 0; i < res.results.length; i++) {
        this.products.push({
          id: res.results[i].ServerId,
          name: res.results[i].Name,
          price: res.results[i].Price
        });
      }
    });
  }

  openOrder(item) {
    this.navCtrl.push(OrderItemPage, {
      productId: item.id,
      orderId : this.orderId,
      price: item.price,
      productName: item.name,
      placeId: this.placeId,
      scheduleId: this.scheduleId,
      placeName: this.placeName
    });
  }

}
