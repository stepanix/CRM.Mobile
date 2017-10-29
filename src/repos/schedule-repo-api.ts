import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {ScheduleModel} from '../models/ScheduleModel';

import * as moment from 'moment';

@Injectable()
export class ScheduleRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new ScheduleModel());
        data.delete();
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new ScheduleModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new ScheduleModel());
        for(var i=0; i<dataDto.length;i++) {
            data.create(dataDto[i]);
        }
     }

     checkOutVisit(dtoScheduleIn : any) {
        var data = new QueryBuilder(new ScheduleModel());
        dtoScheduleIn.VisitStatus = "Out";
        dtoScheduleIn.CheckOutTime = moment().format("YYYY-MM-DD HH:mm");
        dtoScheduleIn.IsSynched = 0;
        console.log("checkoutdata",JSON.stringify(dtoScheduleIn));
        data.where("RepoId", "=", dtoScheduleIn.RepoId).update(dtoScheduleIn);
     }

     getChekedInVisit(){
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("VisitStatus", "=", "In").get();
        return results;
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new ScheduleModel());
        data.create(dataDto);
     }

     list() : Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.get("*");
        return results;
     }

     listByDate(visitDate:string) : Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("VisitDate", "=", visitDate).get();
        return results;
     }

     listById(Id:string) : Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("RepoId", "=", Id).get();
        return results;
     }

     listByScheduleId(Id:string) : Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("RepoId", "=", Id).get();
        return results;
     }

     listUnSynched() : Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new ScheduleModel());
        data.where("ServerId", "=", dataDto.Id).orWhere("Id", "=", dataDto.Id).update(dataDto);
     }

     checkInVisit(dataDto:any) {
        var data = new QueryBuilder(new ScheduleModel());
        data.where("RepoId", "=", dataDto.RepoId).update(dataDto);
     }
     
}