import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
   selector: 'page-visit',
   templateUrl: 'visit.html',
})

export class VisitPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
     console.log('ionViewDidLoad VisitPage');
  }

}
