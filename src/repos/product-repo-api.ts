import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {ProductModel} from '../models/ProductModel';

@Injectable()
export class ProductRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete(){
        var data = new QueryBuilder(new ProductModel());
        data.delete();
     }

     insert(dataDto:any[]){
        var data = new QueryBuilder(new ProductModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     list() : Promise<any>{
        var data = new QueryBuilder(new ProductModel());
        var results = data.get("*");
        return results;
     }

     searchProduct(searchVar) : Promise<any>{
        var data = new QueryBuilder(new ProductModel());
        var results = data.rawQuery("SELECT * FROM product WHERE UPPER(Name) = UPPER(?) OR EanCode = ?", [searchVar,searchVar]);
        return results;
     }
     
}