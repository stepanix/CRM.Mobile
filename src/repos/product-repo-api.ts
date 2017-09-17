import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {ProductModel} from '../models/ProductModel';

@Injectable()
export class ProductRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     deleteProducts(){
        var products = new QueryBuilder(new ProductModel());
        products.delete();
     }

     insertProducts(productDto:any[]){
        var products = new QueryBuilder(new ProductModel());
        for(var i=0; i<productDto.length;i++){
            products.create(productDto[i]);
        }
     }

     listProducts() : Promise<any>{
        var products = new QueryBuilder(new ProductModel());
        var results = products.get("*");
        return results;
     }
     
}