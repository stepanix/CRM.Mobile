import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { ProductServiceApi,FormServiceApi,ScheduleServiceApi } from '../shared/shared';
import {PlaceServiceApi,RetailAuditFormServiceApi,StatusServiceApi} from '../shared/shared';
import { ProductRepoApi } from '../repos/product-repo-api';
import { FormRepoApi } from '../repos/form-repo-api';
import { PlaceRepoApi } from '../repos/place-repo-api';
import {RetailAuditFormRepoApi} from '../repos/retailauditform-repo-api';
import {ScheduleRepoApi} from '../repos/schedule-repo-api';
import {StatusRepoApi} from '../repos/status-repo-api';

@Injectable()
export class SyncServiceApi {
  
    
    constructor(
        private statusRepoApi : StatusRepoApi,
        private statusServiceApi : StatusServiceApi,
        private scheduleRepoApi : ScheduleRepoApi,
        private scheduleServiceApi : ScheduleServiceApi,
        private retailAuditFormRepApi : RetailAuditFormRepoApi,
        private retailAuditFormServiceApi : RetailAuditFormServiceApi,
        private placeServiceApi : PlaceServiceApi,
        private placeRepoApi : PlaceRepoApi,
        private formRepoApi : FormRepoApi, 
        private formServiceApi : FormServiceApi, 
        private productRepoApi : ProductRepoApi,
        private productServiceApi:ProductServiceApi) {        
    }

    downloadProductsApi() {
            var products:any[] = [];
            this.productServiceApi.getProducts()
            .subscribe(
                res => {
                    for(var i = 0;i < res.length; i++) {
                        products.push({
                             Id: i + 1,
                             ServerId: res[i].id,
                             Name: res[i].name
                        });
                    }
                    this.productRepoApi.delete();
                    this.productRepoApi.insert(products);
                    // this.productRepoApi.listProducts().then((data) => {
                    //     for(var i = 0; i<data.results.length;i++){
                    //         console.log(data.results[i].Name);
                    //     }
                    // });
                },err => {
                console.log(err);
                return;
            });
    }

    downloadFormsApi() {
        var forms:any[] = [];
        this.formServiceApi.getForms()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++) {
                    forms.push({
                         Id: i + 1,
                         ServerId: res[i].id,
                         Title: res[i].title,
                         Description: res[i].description,
                         Fields: res[i].fields
                    });
                }
                this.formRepoApi.delete();
                this.formRepoApi.insert(forms);
            },err => {
            console.log(err);
            return;
        });
    }

    downloadPlacesApi() {
        var places:any[] = [];
        this.placeServiceApi.getPlaces()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++) {
                    places.push({
                         Id: i + 1,
                         ServerId: res[i].id,
                         StatusId: res[i].statusId,
                         Name: res[i].name,
                         StreetAddress: res[i].streetAddress,
                         Email: res[i].email,
                         WebSite: res[i].webSite,
                         ContactName: res[i].contactName,
                         ContactTitle: res[i].contactTitle,
                         Phone: res[i].phone,
                         CellPhone: res[i].cellPhone,
                         IsSynched: 1
                    });
                }
                this.placeRepoApi.delete();
                this.placeRepoApi.insert(places);
            },err => {
            console.log(err);
            return;
        });
    }

    downloadRetailAuditFormsApi() {
        var retailAuditForms:any[] = [];
        this.retailAuditFormServiceApi.getRetailAuditForms()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++) {
                    retailAuditForms.push({
                         Id: i + 1,
                         ServerId: res[i].id,
                         Name: res[i].name,
                         Description: res[i].description,
                         Available: res[i].available,
                         Promoted: res[i].promoted,
                         Price: res[i].price,
                         StockLevel: res[i].stockLevel,
                         Note: res[i].note,
                         Fields: res[i].fields
                    });
                }
                this.retailAuditFormRepApi.delete();
                this.retailAuditFormRepApi.insert(retailAuditForms);
            },err => {
            console.log(err);
            return;
        });
    }

    downloadScheduleApi() {
        var schedules:any[] = [];
        this.scheduleServiceApi.getSchedules()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++) {
                    schedules.push({
                         Id: i + 1,
                         ServerId: res[i].id,
                         PlaceId: res[i].placeId,
                         UserId: res[i].userId,
                         VisitDate: res[i].visitDate,
                         VisitTime: res[i].visitTime,
                         VisitNote: res[i].visitNote,
                         IsRecurring: res[i].isRecurring,
                         RepeatCycle: res[i].repeatCycle,
                         IsScheduled: res[i].isScheduled,
                         IsVisited: res[i].isVisited,
                         IsMissed: res[i].isMissed,
                         IsUnScheduled: res[i].isUnScheduled,
                         VisitStatus: res[i].visitStatus,
                         IsSynched: 1
                    });
                }
                this.scheduleRepoApi.delete();
                this.scheduleRepoApi.insert(schedules);
            },err => {
            console.log(err);
            return;
        });
    }

    downloadStatusApi() {
        var status:any[] = [];
        this.statusServiceApi.getStatuses()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++) {
                    status.push({
                         Id: i + 1,
                         ServerId: res[i].id,
                         Name: res[i].name
                    });
                }
                this.statusRepoApi.delete();
                this.statusRepoApi.insert(status);
            },err => {
            console.log(err);
            return;
        });
    }

    downloadServerData() {
        this.downloadStatusApi();
        this.downloadScheduleApi();
        this.downloadRetailAuditFormsApi();
        this.downloadPlacesApi();
        this.downloadProductsApi();
        this.downloadFormsApi();
    }

    
   

}