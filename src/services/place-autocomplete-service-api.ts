import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import {crmBaseUrl} from '../shared/global-vars';
import {PlaceServiceApi} from '../shared/shared';
import {PlaceRepoApi} from '../repos/place-repo-api';

@Injectable()
export class PlacesAutoCompleteService implements AutoCompleteService {
  
    labelAttribute = "name";

    places : any[] = [];

  constructor(private placeRepoApi : PlaceRepoApi,
    private http:Http,private placeServiceApi:PlaceServiceApi) {

        this.listPlacesRepo();
    
        // if(localStorage.getItem("isOnline")==="true") {
        //    this.listPlacesApi();
        // }else{
        //    this.listPlacesRepo();
        // }
  }

    listPlacesRepo() {
            this.places = [];
        this.placeRepoApi.list().then((res) => {
            for(var i = 0; i<res.results.length;i++){
                this.places.push({
                    id : res.results[i].ServerId,
                    name : res.results[i].Name,
                    streetAddress : res.results[i].StreetAddress
                });
            }
        });
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
        if(place.name.toLowerCase().indexOf(query.toLowerCase()) == 0 ) {
            filtered.push(place);
        }
    }
    return filtered;
  }

}