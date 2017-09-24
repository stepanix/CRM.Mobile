import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {FormValueModel} from '../models/FormValueModel';

@Injectable()
export class FormValueRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete() {
        var data = new QueryBuilder(new FormValueModel());
        data.delete();
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new FormValueModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new FormValueModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new FormValueModel());
        data.create(dataDto);
     }

     list():Promise<any> {
        var data = new QueryBuilder(new FormValueModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any>{
        var data = new QueryBuilder(new FormValueModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     listById(serverId:any) : Promise<any>{
        var data = new QueryBuilder(new FormValueModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }
     
}