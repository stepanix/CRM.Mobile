import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import {crmBaseUrl} from '../shared/global-vars';
import {UserServiceApi} from '../shared/shared';
import {UserRepoApi} from '../repos/user-repo-api';

@Injectable()
export class RepsAutoCompleteService implements AutoCompleteService {
  
    labelAttribute = "fullName";

    users : any[] = [];

  constructor(private userRepoApi : UserRepoApi,
              private http:Http,private userServiceApi:UserServiceApi) {
      
        this.listUsersRepo();
        // if(localStorage.getItem("isOnline")==="true") {
        //     this.listUsersApi();
        // }else{
        //     this.listUsersRepo();
        // }

  }

  listUsersRepo() {
      this.users = [];
      this.userRepoApi.list().then((res) => {
          for(var i = 0; i < res.results.length;i++) {
              this.users.push({
                  id : res.results[i].Id,
                  fullName : res.results[i].FirstName + " " + res.results[i].Surname,
                  firstName : res.results[i].FirstName,
                  surname : res.results[i].Surname
              });
          }
      });
  }

  listUsersApi() {
    this.users = [];
    this.userServiceApi.getUsers()
    .subscribe(
        res => {
          for(var i=0; i < res.length;i++) {
              this.users.push({
                 id : res[i].id,
                 fullName : res[i].firstName + " " + res[i].surname,
                 firstName : res[i].firstName,
                 surname : res[i].surname
              });
           }
        },err => {
          console.log(err);
          return;
      });
  }

  getResults(query:string) {
    let filtered : any[] = [];
    for(let i = 0; i < this.users.length; i++) {
        let user = this.users[i];
        if(user.fullName.toLowerCase().indexOf(query.toLowerCase()) == 0
          || user.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0
          || user.surname.toLowerCase().indexOf(query.toLowerCase()) == 0
        ) {
            filtered.push(user);
        }
    }
    return filtered;
  }

}