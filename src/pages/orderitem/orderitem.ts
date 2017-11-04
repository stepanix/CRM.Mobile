import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { OrderItemRepoApi } from '../../repos/orderitem-repo-api';

@Component({
  selector: 'page-orderitem',
  templateUrl: 'orderitem.html',
})
export class OrderItemPage {

  orderId: any;
  productId: any;
  price: any;
  orderItemId: any;
  OrderItemModel: any;
  productName: any;
  operation: any = "save";
  OrderItemDto: any;
  isDisabled : boolean = false;

  constructor(public toastCtrl: ToastController,
    public orderItemRepoApi: OrderItemRepoApi,
    public navCtrl: NavController, public navParams: NavParams) {
    this.OrderItemModel = {};
    this.orderId = this.navParams.get('orderId');
    this.productId = this.navParams.get('productId');
    this.productName = this.navParams.get('productName');
    this.price = this.navParams.get('price');
    this.getOrderItemsRepo();
  }

  ionViewDidLoad() {
  }

  prepareOrderDto() {
    if (this.operation === "save") {
      this.orderItemId = this.newGuid();
    }
    this.OrderItemDto = {
      Id: this.orderItemId,
      ServerId: 0,
      OrderId: this.orderId,
      ProductId: this.productId,
      Quantity: this.OrderItemModel.Quantity,
      Amount: this.OrderItemModel.Amount,
      IsSynched: 0
    };
  }

  saveOrderItemRepo() {
    this.prepareOrderDto();
    if (this.operation === "save") {
      this.orderItemRepoApi.insertRecord(this.OrderItemDto);
    } else {
      console.log("orderitemdto", this.OrderItemDto);
      this.orderItemRepoApi.updateRecord(this.OrderItemDto);
    }
    let toast = this.toastCtrl.create({
      message: 'Item saved successfully',
      duration: 3000
    });
    toast.present();
  }

  getOrderItemsRepo() {
    this.orderItemRepoApi
      .listByProductAndScheduleId(this.orderId, this.productId)
      .then((res) => {
        if (res.length > 0) {
          this.orderItemId = res[0].Id;
          this.OrderItemModel.Quantity = res[0].Quantity;
          this.OrderItemModel.Amount = res[0].Amount;
          this.operation = "update";
        }
      });
  }

  computeAmount() {
    this.OrderItemModel.Amount = parseFloat((this.OrderItemModel.Quantity * this.price).toString()).toFixed(2);
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

}
