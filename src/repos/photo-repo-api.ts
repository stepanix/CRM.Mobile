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

     list():Promise<any> {
        var data = new QueryBuilder(new PhotoModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any>{
        var data = new QueryBuilder(new PhotoModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     listById(serverId:any) : Promise<any>{
        var data = new QueryBuilder(new PhotoModel());
        var results = data.where("ServerId", "=", serverId).get();
        return results;
     }
     
}