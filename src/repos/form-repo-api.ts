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
        var data = new QueryBuilder(new FormModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     list() : Promise<any>{
        var data = new QueryBuilder(new FormModel());
        var results = data.get("*");
        return results;
     }

     listById(serverId:any) : Promise<any>{
        var data = new QueryBuilder(new FormModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }
     
}