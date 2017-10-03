import { Component,NgZone,ViewChild,ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';
import {StatusRepoApi} from '../../repos/status-repo-api';

@Component({
   selector: 'page-addplace',
   templateUrl: 'addplace.html',
})
export class AddPlacePage {

    PlaceModel : any = {};
    status : any[] = [];
    searchControl: FormControl;

    latitude: number;
    longitude: number;
    

    @ViewChild("search")
    searchElementRef: ElementRef;

    constructor(
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

}
