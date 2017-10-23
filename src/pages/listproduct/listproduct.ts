import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ProductRepoApi} from '../../repos/product-repo-api';


@Component({
  selector: 'page-listproduct',
  templateUrl: 'listproduct.html',
})
export class ListProductPage {

  products : any[] = [];

  constructor(public productRepoApi:ProductRepoApi,
              public navCtrl : NavController, 
              public navParams : NavParams) {
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

  }

}
