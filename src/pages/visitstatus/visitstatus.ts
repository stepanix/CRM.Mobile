import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';
import { VisitPage } from '../visit/visit';


@Component({
  selector: 'page-visitstatus',
  templateUrl: 'visitstatus.html',
})
export class VisitStatusPage {

  placeCheckedIn : any = "";
  scheduleId : any;
  placeId : any;
  placeName : any;
  streetAddress : any;
  lat : any;
  lng : any;
  repoId : any;
  serverId : any;

  constructor(private events : Events,
    private scheduleRepoApi : ScheduleRepoApi,
    public navCtrl : NavController,
    public navParams : NavParams) {
        //this.getCheckedInVisit();
  }

  ionViewCanEnter() {
    //this.getCheckedInVisit();
   }

   getCheckedInVisit() {
       console.log("checking visit status");
      this.scheduleRepoApi.getChekedInVisit().then((res) => {
            if (res.results.length > 0) {
                this.placeCheckedIn = " Checked in at " + res.results[0].PlaceName;
                this.serverId = res.results[0].ServerId;
                this.scheduleId = res.results[0].Id;
                this.placeId =  res.results[0].PlaceId;
                this.repoId = res.results[0].RepoId;
                this.placeName = res.results[0].PlaceName;
                this.streetAddress = res.results[0].PlaceAddress;
                this.lat = res.results[0].Latitude;
                this.lng = res.results[0].Longitude;
            }else{
                this.placeCheckedIn = "";
            }
      });
   }

   openVisit() {
        this.navCtrl.setRoot(VisitPage, {
            id : this.serverId,
            repoId : this.repoId,
            scheduleId : this.repoId,
            placeId : this.placeId,
            placeName : this.placeName,
            streetAddress : this.streetAddress,
            lat : this.lat,
            lng : this.lng,
            serverId : this.serverId
       });
   }

}
