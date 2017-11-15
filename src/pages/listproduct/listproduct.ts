import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ProductRepoApi } from '../../repos/product-repo-api';
import { OrderRepoApi } from '../../repos/order-repo-api';
import { OrderItemRepoApi } from '../../repos/orderitem-repo-api';
import { OrdersPage } from '../orders/orders';
import { OrderItemPage } from '../orderitem/orderitem';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import * as moment from 'moment';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';


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
  orderModel: any = {};
  orderItemModel: any = {};
  orderItemsTemp: any[] = [];
  orderId: any;
  orderQty: number = 0;
  loader: any;
  scheduleRepoId: any;
  orderRepoId: any;
  isDisabled: boolean = false;


  constructor(private activityRepoApi: ActivityRepoApi,
    private alertCtrl: AlertController, private syncServiceApi: SyncServiceApi,
    private loading: LoadingController, public atrCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    public orderItemRepoApi: OrderItemRepoApi,
    public orderRepoApi: OrderRepoApi,
    public productRepoApi: ProductRepoApi,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.placeName = this.navParams.get('placeName');
    this.scheduleId = this.navParams.get('scheduleId');
    this.placeId = this.navParams.get('placeId');
    this.scheduleRepoId = this.navParams.get('scheduleRepoId');
    this.orderRepoId = this.navParams.get('orderRepoId');
    this.getProductRepo();
    this.getOrderRepo();
  }

  ionViewDidLoad() {
  }

  logActivityRepo() {
    let ActivityDtoIn = {
      Id: this.newGuid(),
      FullName: localStorage.getItem('fullname'),
      PlaceName: this.placeName,
      PlaceId: this.placeId,
      ActivityLog: 'Orders',
      ActivityTypeId: this.orderId,
      IsSynched: 0,
      DateCreated: moment().format().toString()
    }
    this.activityRepoApi.insertRecord(ActivityDtoIn);
  }

  submitOrder() {
    let alertConfirm = this.alertCtrl.create({
      title: '',
      message: 'Are you sure you want to submit this order ? you will not be able to make changes after submitting',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Submit Order',
          handler: () => {
            this.orderRepoApi.submit(this.scheduleId, this.orderId);
            this.orderItemRepoApi.submit(this.orderId);
            this.loader = this.loading.create({
              content: 'Submitting orders, please wait...',
            });
            this.loader.present().then(() => {
              this.syncServiceApi.downloadServerData();
              this.navCtrl.pop();
              this.loader.dismiss();
            });
          }
        }
      ]
    });
    alertConfirm.present();
  }

  getItems(ev: any) {
    if (ev.target.value === "") {
      this.getProductRepo();
    } else {
      this.searchProduct(ev.target.value);
    }
  }

  scanProductBarCode() {
    this.barcodeScanner.scan().then((barcode) => {
      this.searchProduct(barcode);
    }, (err) => {
      console.log("barcode error", err);
    });
  }

  searchProduct(barcode) {
    this.products = [];
    console.log("barcode", barcode);
    this.productRepoApi.searchProduct(barcode).then((res) => {
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          this.products.push({
            id: res[i].ServerId,
            name: res[i].Name,
            price: res[i].Price
          });
        }
      }
    });
  }

  getOrderRepo() {
    this.orderRepoApi.listByScheduleId(this.scheduleId, this.scheduleRepoId).then((res) => {
      if (res.results.length > 0) {
        for (let i = 0; i < res.results.length; i++) {
          this.orderId = res.results[0].Id;
          this.orderModel = {
            Id: res.results[i].Id,
            Quantity: res.results[i].Quantity,
            DiscountRate: res.results[i].DiscountRate,
            DiscountAmount: res.results[i].DiscountAmount,
            TaxRate: res.results[i].TaxRate,
            TaxAmount: res.results[i].TaxAmount,
            TotalAmount: res.results[i].TotalAmount,
            Amount: res.results[i].Amount,
            OrderDate: res.results[i].OrderDate,
            DueDate: res.results[i].DueDate,
            DueDays: res.results[i].DueDays,
            ServerId: 0,
            PlaceId: res.results[i].PlaceId,
            ScheduleId: res.results[i].ScheduleId,
            Note: res.results[i].Note,
            Signature: res.results[i].Signature,
            IsSynched: 0
          };
          if (res.results[0].Submitted === 2) {
            this.isDisabled = true;
          }
        }
        this.getOrderItemsRepo();
      } else {
        this.createNewOrder();
      }
    });
  }

  getOrderItemsRepo() {
    this.valueOfItemsOrdered = "";
    this.orderItemsTemp = [];
    this.totalItems = 0;
    let totalValue: number = 0;
    this.orderQty = 0;
    this.orderItemRepoApi.listByOrderId(this.orderId, this.orderRepoId).then((res) => {
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
          this.orderQty += parseInt(res.results[i].Quantity);
          if (parseInt(res.results[i].Quantity) > 0) {
            this.totalItems += 1;
          }
          totalValue += parseFloat(parseFloat((res.results[i].Quantity * res.results[i].Amount).toString()).toFixed(2));
        }
        this.valueOfItemsOrdered = parseFloat(totalValue.toString()).toFixed(2);
        this.orderModel.Quantity = this.orderQty;
        this.orderModel.Amount = this.valueOfItemsOrdered;
        this.orderModel.Id = this.orderId;
        this.orderRepoApi.updateRecord(this.orderModel);
        console.log("order", this.orderModel);
      } else {
        this.valueOfItemsOrdered = "0";
        this.totalItems = 0;
      }
    });
  }

  deleteOrder() {
    let alertConfirm = this.atrCtrl.create({
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

  createNewOrder() {
    this.valueOfItemsOrdered = "0";
    this.totalItems = 0;
    this.orderId = this.newGuid();
    let NewOrderModel = {
      Id: this.orderId,
      RepoId: this.orderId,
      PlaceId: this.placeId,
      ScheduleId: this.scheduleId,
      ScheduleRepoId: this.orderId,
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
    this.logActivityRepo();
  }

  addQty(item) {
    this.orderItemModel = this.orderItemsTemp.find(x => x.ProductId === item.id);
    if (this.orderItemModel === undefined) {
      this.orderItemModel = {};
      this.orderItemModel.Id = this.newGuid();
      this.orderItemModel.Quantity = 1;
      this.orderItemModel.ProductId = item.id;
      this.orderItemModel.ServerId = 0;
      this.orderItemModel.IsSynched = 0;
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

  navigateSummary() {
    this.navCtrl.push(OrdersPage, {
      orderId: this.orderId,
      placeId: this.placeId,
      scheduleId: this.scheduleId,
      placeName: this.placeName,
      totalItems: this.totalItems
    });
  }

}
