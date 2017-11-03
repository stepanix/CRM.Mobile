import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {OrderModel} from '../models/OrderModel';

@Injectable()
export class OrderRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new OrderModel());
        data.delete();
     }

     updateSynched(dataDto:any[]) {
        var dtoData = {};
        var data = new QueryBuilder(new OrderModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData = {
               IsSynched : 1
            };
            data.where("Id","=",dataDto[i].syncId).update(dtoData);
        }
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new OrderModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     deleteOrder(orderId:any) {
        var data = new QueryBuilder(new OrderModel());
        data.where("Id","=",orderId).delete();
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new OrderModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        console.log("ordermodel",JSON.stringify(dataDto));
        var data = new QueryBuilder(new OrderModel());
        data.create(dataDto);
     }

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new OrderModel());
        data.where("Id", "=", dataDto.Id).update(dataDto);
     }

     submit(scheduleId: any) {
        var data = new QueryBuilder(new OrderModel());
        data.rawQuery("UPDATE orders SET Submitted = 1 WHERE ScheduleId =?", [scheduleId]);
        // data.where("ScheduleId", "=", scheduleId).update(dataDto);
     }

     list():Promise<any> {
        var data = new QueryBuilder(new OrderModel());
        var results = data.get("*");
        return results;
     }

     listByScheduleId(scheduleId):Promise<any> {
         console.log("orderscheduleid",scheduleId);
        var data = new QueryBuilder(new OrderModel());
        var results = data.where("ScheduleId", "=", scheduleId).get();
        return results;
     }

     listUnSynched() : Promise<any> {
        var data = new QueryBuilder(new OrderModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     listById(serverId:any) : Promise<any> {
        var data = new QueryBuilder(new OrderModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }

     listByOrderId(Id:any) : Promise<any> {
        var data = new QueryBuilder(new OrderModel());
        var results = data.where("Id", "=", Id).get();
        return results;
     }
     
}