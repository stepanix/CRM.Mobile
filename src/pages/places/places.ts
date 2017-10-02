import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import {PlaceRepoApi} from '../../repos/place-repo-api';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';
import { VisitPage } from '../visit/visit';

@Component({
   selector: 'page-places',
   templateUrl: 'places.html',
})
export class PlacesPage {

  places : any[] = [];
  loader : any;

  constructor(private scheduleRepoApi : ScheduleRepoApi,
             private placeRepoApi : PlaceRepoApi,
             public navCtrl: NavController,
             private loading: LoadingController,
             public navParams: NavParams) {
        this.getPlaces();
  }

  ionViewDidLoad() {
    
  }

  getPlaces() {

     this.loader = this.loading.create({
         content: 'Busy please wait...',
     });

     this.loader.present().then(() => {
        this.places = [];
        this.placeRepoApi.list().then((res) => {
            for(var i = 0; i<res.results.length;i++) {
                this.places.push({
                    id : res.results[i].ServerId,
                    name : res.results[i].Name,
                    streetAddress : res.results[i].StreetAddress
                });
            }
            this.loader.dismiss();
        });
      });
  }

  openVisit(item) {
    this.scheduleRepoApi.checkOutVisit();
    this.navCtrl.push(VisitPage, {
        scheduleId : item.id,
        placeId : item.placeId,
        placeName : item.place,
        streetAddress : item.address,
        lat : item.latitude,
        lng : item.longitude
     });
 }



}
