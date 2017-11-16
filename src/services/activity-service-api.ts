import {Injectable }from '@angular/core';
import  {Http,Response,RequestOptions,Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {crmBaseUrl} from '../shared/global-vars';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ActivityServiceApi {

    private token : string;
    private header: Headers;

     constructor(private http:Http){
        
     }

     getHeader() {
        this.header = new Headers();        
        this.token = 'bearer ' + localStorage.getItem('token');
        this.header.append('Authorization', this.token);
        this.header.append('Content-Type', 'application/json');   
        return this.header;
     }

     getActivities() : Observable<any[]> {
          return  this.http.get(crmBaseUrl + "Activity"  ,{headers: this.getHeader()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getActivitiesSummary(userid:any,dateFrom:any,dateTo:any,placeId:any) : Observable<any> {
        //console.log(crmBaseUrl + "Activity/Summary?userid=" + userid + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&placeId=" + placeId);
        return  this.http.get(crmBaseUrl + "Activity/Summary?userid=" + userid + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&placeId=" + placeId  ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getActivitiesRepSummary() : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Activity/RepSummary?userid=" + localStorage.getItem('userid')  ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     addActivityList (activityModel: any[]): Observable<any[]> {
        return this.http.post(crmBaseUrl + "Activity/List", activityModel  ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }
     
}