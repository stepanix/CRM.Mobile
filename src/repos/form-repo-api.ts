import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {FormModel} from '../models/FormModel';

@Injectable()
export class FormRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete(){
        var data = new QueryBuilder(new FormModel());
        data.delete();
     }

     insert(dataDto:any[]){
        var products = new QueryBuilder(new FormModel());
        for(var i=0; i<dataDto.length;i++){
            products.create(dataDto[i]);
        }
     }

     list() : Promise<any>{
        var data = new QueryBuilder(new FormModel());
        var results = data.get("*");
        return results;
     }
     
}