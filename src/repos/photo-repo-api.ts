import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {PhotoModel} from '../models/PhotoModel';

@Injectable()
export class PhotoRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete() {
        var data = new QueryBuilder(new PhotoModel());
        data.delete();
     }

     updateSynched(dataDto:any[]) {
        var dtoData = {};
        var data = new QueryBuilder(new PhotoModel());
        for(var i=0; i<dataDto.length;i++) {
            dtoData ={
                IsSynched : 1,
                Submitted : 2
            };
            data.where("Id","=",dataDto[i].syncId).update(dtoData);
        }
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new PhotoModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     insert(dataDto:any[]) {
        var data = new QueryBuilder(new PhotoModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto:any) {
        var data = new QueryBuilder(new PhotoModel());
        data.create(dataDto);
     }

     updateRecord(dataDto:any) {
        var data = new QueryBuilder(new PhotoModel());
        data.where("Id", "=", dataDto.Id).update(dataDto);
     }

     list():Promise<any> {
        var data = new QueryBuilder(new PhotoModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any>{
        var data = new QueryBuilder(new PhotoModel());
        var results = data.where("Submitted", "=", "1").get();
        return results;
     }

     listById(photoId:any) : Promise<any>{
        var data = new QueryBuilder(new PhotoModel());
        var results = data.where("ServerId", "=", photoId).orWhere("Id","=",photoId).get();
        return results;
     }

     getPhotoForActivity() : Promise<any>{
        var data = new QueryBuilder(new PhotoModel());
        var results = data.get("*");
        return results;
     }

     listByNoteId(Id:any) : Promise<any> {
        var data = new QueryBuilder(new PhotoModel());
        var results = data.where("Id", "=", Id).get();
        return results;
     }

     submit(Id: any) {
        var data = new QueryBuilder(new PhotoModel());
        data.rawQuery("UPDATE photo SET Submitted = 1 WHERE Id =?", [Id]);
     }
     
}