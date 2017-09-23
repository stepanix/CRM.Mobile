import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {UserModel} from '../models/UserModel';

@Injectable()
export class UserRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     delete(){
        var data = new QueryBuilder(new UserModel());
        data.delete();
     }

     insert(dataDto:any[]){
        var data = new QueryBuilder(new UserModel());
        for(var i=0; i<dataDto.length;i++){
            data.create(dataDto[i]);
        }
     }

     list() : Promise<any> {
        var data = new QueryBuilder(new UserModel());
        var results = data.get("*");
        return results;
     }
     
}