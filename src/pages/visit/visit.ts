import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ListFormsPage } from '../listforms/listforms';


@Component({
   selector: 'page-visit',
   templateUrl: 'visit.html',
})

export class VisitPage {

  scheduleId : any;
  placeId : any;
  placeName : any;
  streetAddress : any;
  lat : any;
  lng : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.scheduleId = this.navParams.get('scheduleId');
    this.placeId = this.navParams.get('placeId');
    this.placeName = this.navParams.get('placeName');
    this.streetAddress = this.navParams.get('streetAddress');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
  }

  ionViewDidLoad() {
     
  }

  checkIn(type){
      if(type==="form") {
          this.navCtrl.push(ListFormsPage, {
            scheduleId : this.scheduleId,
            placeId : this.placeId
        });
      }
  }

}
