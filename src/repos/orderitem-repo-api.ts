import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {OrderItemModel} from '../models/OrderItemModel';

@Injectable()
export class OrderItemRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new OrderItemModel());
        data.delete();
     }

     deleteSubmitted() {
        var data = new QueryBuilder(new OrderItemModel());
        data.where("Submitted","=", "2").orWhere("Submitted","=", 2).delete();
     }

     updateSynched(dataDto:any[],orderRepoId:any) {
        var dtoData = {};
        var data = new QueryBuilder(new OrderItemModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData = {
               IsSynched : 1,
               Submitted : 2
            };
            data.where("OrderId","=",orderRepoId).update(dtoData);
        }
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new OrderItemModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new OrderItemModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new OrderItemModel());
        data.create(dataDto);
     }

     submit(orderId: any) {
        var data = new QueryBuilder(new OrderItemModel());
        data.rawQuery("UPDATE orderitems SET Submitted = 1 WHERE OrderId =?", [orderId]);
     }

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new OrderItemModel());
        data.where("Id", "=", dataDto.Id).update(dataDto);
     }

     list():Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.get("*");
        return results;
     }

     listByScheduleId(scheduleId):Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.where("ScheduleId", "=", scheduleId).get();
        return results;
     }

     listUnSynched() : Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.where("Submitted", "=", "1").get();
        return results;
     }

     listById(serverId:any) : Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }

     listByOrderItemId(Id:any) : Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.where("Id", "=", Id).get();
        return results;
     }

     deleteOrderItems(orderId:any) {
        var data = new QueryBuilder(new OrderItemModel());
        data.where("OrderId","=",orderId).delete();
     }

     listByOrderId(OrderId:any,OrderRepoId : any) : Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.where("OrderId", "=", OrderId).orWhere("OrderId", "=", OrderRepoId).get();
        return results;
     }

     listByProductAndScheduleId(orderId:any,productId:any) : Promise<any> {
        var data = new QueryBuilder(new OrderItemModel());
        var results = data.rawQuery("SELECT * FROM orderitems WHERE OrderId =? AND ProductId=?", [orderId,productId]);
        return results;
     }
     
}