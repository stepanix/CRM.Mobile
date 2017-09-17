import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import {crmBaseUrl} from '../shared/global-vars';
import {PlaceServiceApi} from '../shared/shared';

@Injectable()
export class PlacesAutoCompleteService implements AutoCompleteService {
  
    labelAttribute = "name";

    places : any[] = [];

  constructor(private http:Http,private placeServiceApi:PlaceServiceApi) {
     this.listPlacesApi();
  }


  listPlacesApi(){
    this.places = [];
    this.placeServiceApi.getPlaces()
    .subscribe(
        res => {
            this.places = res;
        },err => {
          console.log(err);
          return;
      });
  }

  getResults(query:string) {
    let filtered : any[] = [];
    for(let i = 0; i < this.places.length; i++) {
        let place = this.places[i];
        if(place.name.toLowerCase().indexOf(query.toLowerCase()) == 0
          || place.streetAddress.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(place);
        }
    }
    return filtered;
  }

}