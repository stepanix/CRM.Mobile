import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {RetailAuditFormModel} from '../models/RetailAuditFormModel';

@Injectable()
export class RetailAuditFormRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete(){
        var data = new QueryBuilder(new RetailAuditFormModel());
        data.delete();
     }

     insert(dataDto:any[]){
        var data = new QueryBuilder(new RetailAuditFormModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     list() : Promise<any>{
        var data = new QueryBuilder(new RetailAuditFormModel());
        var results = data.get("*");
        return results;
     }
     
}