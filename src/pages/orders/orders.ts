import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
   selector: 'page-orders',
   templateUrl: 'orders.html',
})
export class OrdersPage {

  OrderModel : any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams) {
     this.OrderModel = {};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
