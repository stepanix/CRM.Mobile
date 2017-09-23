import {Injectable }from '@angular/core';
import {QueryBuilder} from '../services/query-builder';
import {UserModel} from '../models/UserModel';

@Injectable()
export class UserRepoApi {
      
     private header:Headers;

     constructor() {
            
     }

     list() : Promise<any> {
        var data = new QueryBuilder(new UserModel());
        var results = data.get("*");
        return results;
     }
     
}