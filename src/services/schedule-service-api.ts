import {Injectable }from '@angular/core';
import  {Http,Response,RequestOptions,Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {crmBaseUrl} from '../shared/global-vars';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ScheduleServiceApi {

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

     getSchedulesDateRange(dateFrom,dateTo) : Observable<any[]> {
         console.log(crmBaseUrl + "Schedule/DateRange?dateFrom=" + dateFrom + "&dateTo=" + dateTo);
        return  this.http.get(crmBaseUrl + "Schedule/DateRange?dateFrom=" + dateFrom + "&dateTo=" + dateTo  ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }
  
     getSchedulesRep(dateFrom,dateTo,rep) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Schedule/Rep?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&rep=" + rep ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }
  
     getSchedulesPlace(dateFrom,dateTo,place) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Schedule/Place?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&place=" + place ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }
  
     getSchedulesRepAndPlace(dateFrom,dateTo,rep,place) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Schedule/RepAndPlace?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&rep=" + rep + "&place=" + place ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getSchedulesByStatus(isVisited:boolean,isScheduled:boolean,isUnScheduled:boolean ,isMissed:boolean) : Observable<any[]> {
         console.log(crmBaseUrl + "Schedule/ByStatus?isVisited=" + isVisited + "&isScheduled=" + isScheduled +"&isUnScheduled=" + isUnScheduled +"&isMissed=" + isMissed);
        return  this.http.get(crmBaseUrl + "Schedule/ByStatus?isVisited=" + isVisited + "&isScheduled=" + isScheduled +"&isUnScheduled=" + isUnScheduled +"&isMissed=" + isMissed ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
    }

     getSchedules() : Observable<any[]> {
          return  this.http.get(crmBaseUrl + "Schedule" ,{headers: this.getHeader()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getMySchedules(scheduleDate) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Schedule/MySchedules?scheduleDate=" + scheduleDate,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getSchedule(id:number) : Observable<any> {
        return  this.http.get(crmBaseUrl + "Schedule/" + id ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     addSchedule (scheduleModel: any): Observable<any> {
        return this.http.post(crmBaseUrl + "Schedule", scheduleModel ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }

     addScheduleList (scheduleModel: any[]): Observable<any[]> {
        return this.http.post(crmBaseUrl + "Schedule/List", scheduleModel ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }

     updateSchedule (scheduleModel: any): Observable<any> {
        return this.http.put(crmBaseUrl + "Schedule", scheduleModel ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }
     
     deleteSchedule (id: any): Observable<any> {
        return this.http.delete(crmBaseUrl + "Schedule/" + id ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }
   
     
}