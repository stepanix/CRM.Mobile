import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {ScheduleModel} from '../models/ScheduleModel';

@Injectable()
export class ScheduleRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete(){
        var data = new QueryBuilder(new ScheduleModel());
        data.delete();
     }

     insert(dataDto:any[]){
        var data = new QueryBuilder(new ScheduleModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any){
        var data = new QueryBuilder(new ScheduleModel());
        data.create(dataDto);
     }

     list() : Promise<any>{
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.get("*");
        return results;
     }

     listByDate(visitDate:string) : Promise<any>{
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("VisitDate", "=", visitDate).get();
        return results;
     }

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new ScheduleModel());
        data.where("ServerId", "=", dataDto.id).update(dataDto);
     }
     
}