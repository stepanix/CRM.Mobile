import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  eventDate : any = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.eventDate = new Date().toISOString();
  }

  ionViewDidLoad() {

  }

}
