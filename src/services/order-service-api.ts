import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { crmBaseUrl } from '../shared/global-vars';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class OrderServiceApi {

    private token: string;
    private header: Headers;

    constructor(private http: Http) {
    }

    getHeader() {
        this.header = new Headers();
        this.token = 'bearer ' + localStorage.getItem('token');
        this.header.append('Authorization', this.token);
        this.header.append('Content-Type', 'application/json');
        return this.header;
    }

    addOrder(orderModel: any): Observable<any> {
        return this.http.post(crmBaseUrl + "Order", orderModel, { headers: this.getHeader() }) // ...using post request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json() || 'Server error')); //...errors if any
    }

    addOrderList(orderModel: any[]): Observable<any[]> {
        return this.http.post(crmBaseUrl + "Order/List", orderModel, { headers: this.getHeader() }) // ...using post request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json() || 'Server error')); //...errors if any
    }

    getOrderSummary(userid:any,dateFrom:any,dateTo:any) : Observable<any[]> {
        return  this.http.get(crmBaseUrl + "Order/Rep?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&rep=" + userid  ,{headers: this.getHeader()})
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error.json() || 'Server error'));
     }

}