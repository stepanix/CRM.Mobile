import {Injectable }from '@angular/core';
import  {Http,Response,RequestOptions,Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {crmBaseUrl} from '../shared/global-vars';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class PlaceServiceApi {

    private token : string;
    private header: Headers;

     constructor(private http:Http) {
        
     }

     getHeader() {
        this.header = new Headers();        
        this.token = 'bearer ' + localStorage.getItem('token');
        this.header.append('Authorization', this.token);
        this.header.append('Content-Type', 'application/json');   
        return this.header; 
     }

     getPlaces() : Observable<any[]> {
          return  this.http.get(crmBaseUrl + "Place",{headers: this.getHeader()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getPlacesDateRange(dateFrom,dateTo) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Place/DateRange?dateFrom=" + dateFrom + "&dateTo=" + dateTo  ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }
  
     getPlacesRep(dateFrom,dateTo,rep) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Place/Rep?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&rep=" + rep ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getPlace(id:number) : Observable<any> {
        return  this.http.get(crmBaseUrl + "Place/" + id  ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     addPlace (placeModel: any): Observable<any> {
        return this.http.post(crmBaseUrl + "Place", placeModel  ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }

     addPlaceList (placeModel: any[]): Observable<any[]> {
        return this.http.post(crmBaseUrl + "Place/List", placeModel ,{headers: this.getHeader()})
                         .map((res:Response) => res.json())
                         .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     updatePlace (placeModel: any): Observable<any> {
        return this.http.put(crmBaseUrl + "Place", placeModel  ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }
    
     deletePlace (id: any): Observable<any> {
        return this.http.delete(crmBaseUrl + "Place/" + id  ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }
     

   
     
}