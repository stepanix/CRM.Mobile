import {Injectable }from '@angular/core';
import  {Http,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {loginUrl} from '../shared/global-vars';

@Injectable()
export class LoginServiceApi {
      
     private header:Headers;

     constructor(private http:Http) {
            
     }

     getHeader() {
        this.header = new Headers();        
        this.header.append('Content-Type', 'application/x-www-form-urlencoded');   
        return this.header; 
     }

     postLogin(loginData) : Observable<any> {
          return  this.http.post(loginUrl , loginData,{headers: this.getHeader()})
          .map((response: Response) => response.json())
          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }
     
}

