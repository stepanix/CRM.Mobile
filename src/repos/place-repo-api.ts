import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {PlaceModel} from '../models/PlaceModel';

@Injectable()
export class PlaceRepoApi {
      
     private header:Headers;

     constructor() {
     }

     delete() {
        var data = new QueryBuilder(new PlaceModel());
        data.delete();
     }

     insert(dataDto : any[]) {
        var data = new QueryBuilder(new PlaceModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     insertRecord(dataDto : any) {
        var data = new QueryBuilder(new PlaceModel());
        data.create(dataDto);
     }

     list() : Promise<any> {
        var data = new QueryBuilder(new PlaceModel());
        var results = data.get("*");
        return results;
     }

     listUnSynched() : Promise<any> {
        var data = new QueryBuilder(new PlaceModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
     }

     deleteSynched(dataDto:any[]) {
        var data = new QueryBuilder(new PlaceModel());
        for(var i=0; i<dataDto.length;i++) {
            data.where("Id","=",dataDto[i].syncId).delete();
        }
     }

     getPlaceForActivity() : Promise<any>{
        var data = new QueryBuilder(new PlaceModel());
        var results = data.get("*");
        return results;
     }
     
}