import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { ProductServiceApi,FormServiceApi } from '../shared/shared';
import {PlaceServiceApi} from '../shared/shared';
import { ProductRepoApi } from '../repos/product-repo-api';
import { FormRepoApi } from '../repos/form-repo-api';
import { PlaceRepoApi } from '../repos/place-repo-api';

@Injectable()
export class SyncServiceApi {
  
    labelAttribute = "name";

    places : any[] = [];

    constructor(
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
   

}