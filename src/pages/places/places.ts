import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import {PlaceRepoApi} from '../../repos/place-repo-api';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';
import { VisitPage } from '../visit/visit';
import { AddPlacePage } from '../addplace/addplace';

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
                    streetAddress : res.results[i].StreetAddress,
                    placeId : this.parsePlaceId(res.results[i].ServerId,res.results[i].RepoId),
                    latitude : res.results[i].Latitude,
                    longitude : res.results[i].Longitude
                });
             }
             this.loader.dismiss();
          });
      });
  }

  parsePlaceId(serverid,repoid) {
     if(serverid==="0") {
        return repoid;
     }else{
        return serverid;
     }
  }

  openVisit(item) {
    this.scheduleRepoApi.checkOutVisit();
    this.navCtrl.push(VisitPage, {
        scheduleId : this.newGuid(),
        repoId : this.newGuid(),
        placeId : item.placeId,
        placeName : item.name,
        streetAddress : item.address,
        lat : item.latitude,
        lng : item.longitude
     });
 }

 addPlace() {
    this.navCtrl.setRoot(AddPlacePage);
 }

  newGuid() : string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
  }


}
