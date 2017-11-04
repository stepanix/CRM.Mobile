import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {NoteModel} from '../models/NoteModel';

@Injectable()
export class NoteRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new NoteModel());
        data.delete();
     }

     updateSynched(dataDto:any[]) {
        var dtoData = {};
        var data = new QueryBuilder(new NoteModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData = {
               IsSynched : 1
            };
            data.where("Id","=",dataDto[i].syncId).update(dtoData);
        }
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new NoteModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new NoteModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new NoteModel());
        data.create(dataDto);
     }

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new NoteModel());
        data.where("Id", "=", dataDto.Id).update(dataDto);
     }

     list():Promise<any> {
        var data = new QueryBuilder(new NoteModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any> {
        var data = new QueryBuilder(new NoteModel());
        var results = data.where("Submitted", "=", "1").get();
        return results;
     }

     listById(serverId:any) : Promise<any> {
        var data = new QueryBuilder(new NoteModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }

     listByNoteId(Id:any) : Promise<any> {
        var data = new QueryBuilder(new NoteModel());
        var results = data.where("Id", "=", Id).get();
        return results;
     }

     submit(Id: any) {
        var data = new QueryBuilder(new NoteModel());
        data.rawQuery("UPDATE note SET Submitted = 1 WHERE Id =?", [Id]);
     }
     
}