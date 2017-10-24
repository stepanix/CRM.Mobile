import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ActivityServiceApi} from '../../shared/shared';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  formsCount : any = 0;
  retailAuditCount : any = 0;
  photosCount : any = 0;
  placeNotesCount : any = 0;
  ordersCount : any = 0;

  constructor(public activityServiceApi : ActivityServiceApi,
    public navCtrl: NavController, 
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
  }

}
