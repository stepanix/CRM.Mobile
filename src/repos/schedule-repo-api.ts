import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {ScheduleModel} from '../models/ScheduleModel';
import * as moment from 'moment';

@Injectable()
export class ScheduleRepoApi {
      
     private header:Headers;
     dtoScheduleIn : any[];

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

     checkOutVisit() {
        this.dtoScheduleIn = [];
        var data = new QueryBuilder(new ScheduleModel());
        this.list().then((res) => {
            for(var i = 0; i<res.results.length;i++) {
                 this.dtoScheduleIn.push({                    
                        VisitStatus : 'Out',
                        IsVisited : true,
                        CheckOutTime : moment().format("YYYY-MM-DD HH:mm"),
                        IsSynched : 0
                 });
                 data.where("VisitStatus", "=", "In").update(this.dtoScheduleIn[i]);
             }
         });
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
        var results = data.where("VisitDate", "=", visitDate).where("IsScheduled", "=", "true").get();
        return results;
     }

     listById(serverId:any) : Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("ServerId", "=", serverId).orWhere("RepoId", "=", serverId).get();
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
        data.where("ServerId", "=", dataDto.Id).orWhere("Id", "=", dataDto.Id).update(dataDto);
     }
     
}