import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { ProductServiceApi,FormServiceApi } from '../shared/shared';
import {PlaceServiceApi} from '../shared/shared';
import { ProductRepoApi } from '../repos/product-repo-api';
import { FormRepoApi } from '../repos/form-repo-api';

@Injectable()
export class SyncServiceApi {
  
    labelAttribute = "name";

    places : any[] = [];

    constructor(
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

}