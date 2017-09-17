import {Injectable }from '@angular/core';
import  {Http,Response,RequestOptions,Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {crmBaseUrl} from '../shared/global-vars';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class UserServiceApi {

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

     getUsers() : Observable<any[]> {
          return  this.http.get(crmBaseUrl + "User" ,{headers: this.getHeader()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getUser(id:string) : Observable<any> {
        return  this.http.get(crmBaseUrl + "User/"+ id ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     getUnAssignedReps(placeid:number) : Observable<any[]> {
         //console.log(crmBaseUrl + "User/UnAssignedReps?placeId=" + placeid);
        return  this.http.get(crmBaseUrl + "User/UnAssignedReps?placeId=" + placeid ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

     addUser (UserModel: any): Observable<any> {
        return this.http.post(crmBaseUrl + "Account/Register", UserModel ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }

     updateUser (UserModel: any) : Observable<any> {
        return this.http.put(crmBaseUrl + "User", UserModel ,{headers: this.getHeader()}) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json() || 'Server error')); //...errors if any
     }
     
}