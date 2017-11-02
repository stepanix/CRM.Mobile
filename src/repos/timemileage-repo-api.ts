import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {TimeMileageModel} from '../models/TimeMileageModel';

@Injectable()
export class TimeMileageRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new TimeMileageModel());
        data.delete();
     }

     updateSynched(dataDto:any[]) {
        var dtoData = {};
        var data = new QueryBuilder(new TimeMileageModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData ={
                IsSynched : 1
            };
            data.where("Id","=",dataDto[i].syncId).update(dtoData);
        }
     }

     updateMileage(dtoData:any) {
        var data = new QueryBuilder(new TimeMileageModel());
        data.where("DateCreated","=",dtoData.DateCreated).update(dtoData);
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new TimeMileageModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new TimeMileageModel());
        data.create(dataDto);
     }

     searchByDate(dateCreated:any):Promise<any> {
        var data = new QueryBuilder(new TimeMileageModel());
        var results = data.where("DateCreated", "=", dateCreated).get();
        return results;
     }

     listAll():Promise<any> {
        var data = new QueryBuilder(new TimeMileageModel());
        var results = data.get();
        return results;
     }

     listUnSynched() : Promise<any>{
        var data = new QueryBuilder(new TimeMileageModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     listById(serverId:any) : Promise<any>{
        var data = new QueryBuilder(new TimeMileageModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }
     
}