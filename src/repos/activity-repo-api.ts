import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {ActivityModel} from '../models/ActivityModel';

@Injectable()
export class ActivityRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new ActivityModel());
        data.delete();
     }

     updateSynched(dataDto:any[]) {
        var dtoData = {};
        var data = new QueryBuilder(new ActivityModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData ={
                IsSynched : 1
            };
            data.where("Id","=",dataDto[i].syncId).update(dtoData);
        }
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new ActivityModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new ActivityModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new ActivityModel());
        data.create(dataDto);
     }

     list():Promise<any> {
        var data = new QueryBuilder(new ActivityModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any>{
        var data = new QueryBuilder(new ActivityModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     listById(serverId:any) : Promise<any>{
        var data = new QueryBuilder(new ActivityModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }
     
}