import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ProductRepoApi} from '../../repos/product-repo-api';
import { OrdersPage } from '../orders/orders';


@Component({
  selector: 'page-listproduct',
  templateUrl: 'listproduct.html',
})
export class ListProductPage {

  products : any[] = [];
  scheduleId : any;
  placeId : any;
  placeName : string;

  constructor(public productRepoApi:ProductRepoApi,
              public navCtrl : NavController, 
              public navParams : NavParams) {
      this.placeName = this.navParams.get('placeName');
      this.scheduleId = this.navParams.get('scheduleId');
      this.placeId = this.navParams.get('placeId');          
      this.getProductRepo();
  }

  ionViewDidLoad() {

  }

  getProductRepo() {
       this.products = [];
       this.productRepoApi.list().then((res) => {
          for (var i = 0; i<res.results.length;i++) {
                this.products.push({
                    id : res.results[i].ServerId,
                    name : res.results[i].Name
                 });
             }
        });
  }

  openOrder(item) {
      this.navCtrl.push(OrdersPage, {
        productId : item.id,
        productName : item.name,
        placeId : this.placeId,
        scheduleId : this.scheduleId,
        placeName : this.placeName
    });
  }

}
