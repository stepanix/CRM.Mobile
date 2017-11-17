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

     deleteSubmitted() {
        var data = new QueryBuilder(new FormValueModel());
        data.where("Submitted","=", "2").orWhere("Submitted","=", 2).delete();
     }

     updateSynched(dataDto:any[]) {
        var dtoData = {};
        var data = new QueryBuilder(new FormValueModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData ={
                IsSynched : 1,
                Submitted : 2
            };
            data.where("Id","=",dataDto[i].syncId).update(dtoData);
        }
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

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new FormValueModel());        
        data.where("Id","=",dataDto.Id).update(dataDto);      
     }

     list():Promise<any> {
        var data = new QueryBuilder(new FormValueModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any>{
        var data = new QueryBuilder(new FormValueModel());
        var results = data.where("Submitted", "=", "1").get();
        return results;
     }

     listById(serverId:any) : Promise<any>{
        var data = new QueryBuilder(new FormValueModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }

     listByFormId(Id:any) : Promise<any>{
        var data = new QueryBuilder(new FormValueModel());
        var results = data.where("Id", "=", Id).get();
        return results;
     }

     submit(Id: any) {
        var data = new QueryBuilder(new FormValueModel());
        data.rawQuery("UPDATE formValue SET Submitted = 1 WHERE Id =?", [Id]);
     }
     
}