import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {StatusModel} from '../models/StatusModel';

@Injectable()
export class StatusRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete(){
        var data = new QueryBuilder(new StatusModel());
        data.delete();
     }

     insert(dataDto:any[]){
        var data = new QueryBuilder(new StatusModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     list() : Promise<any>{
        var data = new QueryBuilder(new StatusModel());
        var results = data.get("*");
        return results;
     }
     
}