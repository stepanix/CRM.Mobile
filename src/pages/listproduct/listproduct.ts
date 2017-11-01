import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductRepoApi } from '../../repos/product-repo-api';
import { OrderRepoApi } from '../../repos/order-repo-api';
import { OrderItemRepoApi } from '../../repos/orderitem-repo-api';
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
  valueOfItemsOrdered: string = "";
  totalItems: number = 0;
  orderModel: any[] = [];
  orderItemModel: any = {};
  orderItemsTemp: any[] = [];
  orderId: any;
  itemQty : number = 0;

  constructor(public orderItemRepoApi: OrderItemRepoApi,
    public orderRepoApi: OrderRepoApi,
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
        this.getOrderItemsRepo();
      } else {
        this.createNewOrder();
        //this.totalItems =  1;
      }
    });
  }

  getOrderItemsRepo() {
    this.valueOfItemsOrdered = "";
    this.orderItemsTemp = [];
    this.totalItems = 0;    
    let totalValue : number = 0;
    this.orderItemRepoApi.listByOrderId(this.orderId).then((res) => {
      if (res.results.length > 0) {
        for (let i = 0; i < res.results.length; i++) {
          this.orderItemsTemp.push({
            Id: res.results[i].Id,
            ServerId: res.results[i].ServerId,
            OrderId: res.results[i].OrderId,
            ProductId: res.results[i].ProductId,
            Quantity: res.results[i].Quantity,
            Amount: res.results[i].Amount,
            IsSynched: 0
          });
          this.totalItems += parseInt(res.results[i].Quantity);
          totalValue +=  parseFloat(parseFloat((res.results[i].Quantity * res.results[i].Amount).toString()).toFixed(2));
        }
        this.valueOfItemsOrdered = parseFloat(totalValue.toString()).toFixed(2);
      } else {
        this.valueOfItemsOrdered = "0";
        this.totalItems = 0;
      }
    });
  }

  deleteOrder() {
    this.orderItemRepoApi.deleteOrderItems(this.orderId);
    this.orderRepoApi.deleteOrder(this.orderId);
    this.navCtrl.pop();
  }

  createNewOrder() {
    this.valueOfItemsOrdered = "0";
    this.totalItems = 0;
    this.orderId = this.newGuid();
    let NewOrderModel = {
      Id: this.orderId,
      RepoId : this.orderId,
      PlaceId: this.placeId,
      ScheduleId: this.scheduleId,
      ServerId: 0,
      Quantity: 0,
      Amount: "0",
      DiscountRate: "0",
      DiscountAmount: "0",
      TaxRate: "0",
      TaxAmount: "0",
      TotalAmount: "0",
      OrderDate: moment().format('YYYY-MM-DD').toString(),
      DueDays: "0",
      DueDate: moment().format('YYYY-MM-DD').toString(),
      Note: "",
      Signature: "",
      IsSynched: 0
    }
    this.orderRepoApi.insertRecord(NewOrderModel);
  }

  addQty(item) {
    this.orderItemModel = this.orderItemsTemp.find(x => x.ProductId === item.id);
    if (this.orderItemModel === undefined) {
      this.orderItemModel = {};
      this.orderItemModel.Id = this.newGuid();
      this.orderItemModel.Quantity = 1;
      this.orderItemModel.ProductId = item.id;
      this.orderItemModel.ServerId = 0;
      this.orderItemModel.IsSynched = 0
      this.orderItemModel.OrderId = this.orderId;
      this.orderItemModel.Amount = item.price;
      this.orderItemRepoApi.insertRecord(this.orderItemModel);
      this.getOrderItemsRepo();
    } else {
      this.orderItemModel.Quantity += 1;
      this.orderItemModel.Amount = parseFloat((item.price * this.orderItemModel.Quantity).toString()).toFixed(2);
      this.orderItemRepoApi.updateRecord(this.orderItemModel);
      this.getOrderItemsRepo();
    }
  }

  removeQty(item) {
    this.orderItemModel = this.orderItemsTemp.find(x => x.ProductId === item.id);
    this.orderItemModel.Quantity -= 1;
    this.orderItemModel.Amount = parseFloat((item.price * this.orderItemModel.Quantity).toString()).toFixed(2);
    this.orderItemRepoApi.updateRecord(this.orderItemModel);
    this.getOrderItemsRepo();
  }

  checkItemQty(item) {
    this.orderItemModel = this.orderItemsTemp.find(x => x.ProductId === item.id);
    if (this.orderItemModel === undefined) {
      return 0;
    } else {
      return this.orderItemModel.Quantity;
    }
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
      orderId: this.orderId,
      price: item.price,
      productName: item.name,
      placeId: this.placeId,
      scheduleId: this.scheduleId,
      placeName: this.placeName
    });
  }

}
