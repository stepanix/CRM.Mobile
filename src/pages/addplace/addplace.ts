import { Component,NgZone,ViewChild,ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';
import {StatusRepoApi} from '../../repos/status-repo-api';
import {PlaceRepoApi} from '../../repos/place-repo-api';
import {ScheduleRepoApi} from '../../repos/schedule-repo-api';

import { VisitPage } from '../visit/visit';

import * as moment from 'moment';

@Component({
   selector: 'page-addplace',
   templateUrl: 'addplace.html',
})
export class AddPlacePage {

    PlaceModel : any = {};
    status : any[] = [];
    searchControl: FormControl;
    placeRepoId : string;
    scheduleRepoId : string;

    latitude: number;
    longitude: number;

    @ViewChild("search")
    searchElementRef: ElementRef;

    constructor(private scheduleRepoApi:ScheduleRepoApi,
        private placeRepoApi : PlaceRepoApi,
        private statusRepoApi : StatusRepoApi,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public navCtrl: NavController, 
        public navParams: NavParams) {
        
          this.PlaceModel.Name = "";
          this.PlaceModel.SelectedStatus = -1;
          this.PlaceModel.StreetAddress ="";
        
          this.PlaceModel.ContactName = "";
          this.PlaceModel.ContactTitle = "";
          this.PlaceModel.Phone = "";
          this.PlaceModel.CellPhone = "";
          this.PlaceModel.Email = "";
          this.PlaceModel.Website = "";
          this.searchControl = new FormControl();
          

          this.latitude = -26.0323027;
          this.longitude = 28.0363948;

          this.listStatusRepo();

          this.mapsAPILoader.load().then(() => {
            
                        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                            types: ["address"]
                        });
            
                        autocomplete.addListener("place_changed", () => {
                          this.ngZone.run(() => {
                                  //get the place result
                                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                      
                                  //verify result
                                  if (place.geometry === undefined || place.geometry === null) {
                                    return;
                                  }
                              
                                  this.PlaceModel.StreetAddress = place.formatted_address;
                                  //set latitude, longitude and zoom
                                  this.latitude = place.geometry.location.lat();
                                  this.longitude = place.geometry.location.lng();
                              });
                          });
                      });

         
    }

    savePlaceRepo() {
        this.placeRepoId = this.newGuid();
        this.PlaceModel = {
            Id: this.placeRepoId,
            ServerId: 0,
            StatusId: this.PlaceModel.SelectedStatus,
            Name: this.PlaceModel.Name,
            StreetAddress: this.PlaceModel.StreetAddress,
            Email: this.PlaceModel.Email,
            Website: this.PlaceModel.Website,
            ContactName: this.PlaceModel.ContactName,
            ContactTitle: this.PlaceModel.ContactTitle,
            Phone: this.PlaceModel.Phone,
            CellPhone: this.PlaceModel.CellPhone,            
            Latitude: this.latitude,
            Longitude : this.longitude,
            IsSynched : 0,
            RepoId : this.placeRepoId
        };
        this.placeRepoApi.insertRecord(this.PlaceModel);
        this.isAnyPlaceCheckedIn();
     }

     isAnyPlaceCheckedIn() {
        this.scheduleRepoApi.getChekedInVisit().then((res) => {
            if (res.results.length > 0) {
                this.navCtrl.setRoot(VisitPage, {
                    scheduleId: res.results[0].RepoId,
                    repoId: res.results[0].RepoId,
                    placeId: parseInt(res.results[0].PlaceId),
                    placeName: res.results[0].PlaceName,
                    streetAddress: res.results[0].PlaceAddress,
                    lat: res.results[0].Latitude,
                    lng: res.results[0].Longitude
                });
            } else {
                this.createVisitToPlace();
            }
        });
    }


     createVisitToPlace(){
        this.scheduleRepoId = this.newGuid();
        let ScheduleDto = {
            Id: this.scheduleRepoId,
            RepoId : this.scheduleRepoId,
            ServerId :  0,
            PlaceId : this.placeRepoId,
            PlaceName : this.PlaceModel.Name,
            PlaceAddress : this.PlaceModel.StreetAddress,
            UserId : localStorage.getItem('userid'),
            VisitDate : moment().format('YYYY-MM-DD').toString() + "T00:00:00",
            VisitTime : "",
            VisitNote : "",
            IsRecurring : false,
            RepeatCycle : 0,
            IsScheduled : false,
            IsVisited : true,
            IsMissed : false,
            IsUnScheduled : true,
            VisitStatus : 'In',
            CheckInTime : moment().format("YYYY-MM-DD HH:mm"),
            Latitude : this.latitude,
            Longitude : this.longitude,
            IsSynched: 0
        };
        this.scheduleRepoApi.insertRecord(ScheduleDto);
        this.navCtrl.push(VisitPage, {
             scheduleId : this.scheduleRepoId,
             placeId : this.placeRepoId,
             placeName : this.PlaceModel.Name,
             streetAddress : this.PlaceModel.StreetAddress,
             lat : this.latitude,
             lng : this.longitude
         });
     }

    ionViewDidLoad() {
    }

    listStatusRepo(){
          this.status = [];
          this.statusRepoApi.list().then((res) => {
            for(var i = 0; i<res.results.length;i++) {
                this.status.push({
                    id : res.results[i].ServerId,
                    name : res.results[i].Name
                });
            }
        });
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
