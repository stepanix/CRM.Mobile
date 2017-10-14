import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { ProductServiceApi,FormServiceApi,ScheduleServiceApi,UserServiceApi,PhotoServiceApi } from '../shared/shared';
import {PlaceServiceApi,RetailAuditFormServiceApi,StatusServiceApi,FormValueServiceApi} from '../shared/shared';
import { ProductRepoApi } from '../repos/product-repo-api';
import { FormRepoApi } from '../repos/form-repo-api';
import { PlaceRepoApi } from '../repos/place-repo-api';
import {RetailAuditFormRepoApi} from '../repos/retailauditform-repo-api';
import {ScheduleRepoApi} from '../repos/schedule-repo-api';
import {StatusRepoApi} from '../repos/status-repo-api';
import {UserRepoApi} from '../repos/user-repo-api';
import {FormValueRepoApi} from '../repos/formvalue-repo-api';
import {PhotoRepoApi} from '../repos/photo-repo-api';

@Injectable()
export class SyncServiceApi {
  
    placesTemp : any[] = [];
    scheduleTemp : any[] =[];
    
    constructor(private photoServiceAPi : PhotoServiceApi,
        private photoRepoApi : PhotoRepoApi,
        private formValueServiceApi : FormValueServiceApi,
        private formValueRepoApi : FormValueRepoApi,
        private userRepoApi : UserRepoApi,
        private statusRepoApi : StatusRepoApi,
        private statusServiceApi : StatusServiceApi,
        private scheduleRepoApi : ScheduleRepoApi,
        private scheduleServiceApi : ScheduleServiceApi,
        private retailAuditFormRepApi : RetailAuditFormRepoApi,
        private retailAuditFormServiceApi : RetailAuditFormServiceApi,
        private userServiceApi : UserServiceApi,
        private placeServiceApi : PlaceServiceApi,
        private placeRepoApi : PlaceRepoApi,
        private formRepoApi : FormRepoApi, 
        private formServiceApi : FormServiceApi, 
        private productRepoApi : ProductRepoApi,
        private productServiceApi : ProductServiceApi) {
    }

    newGuid():string {
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    downloadProductsApi() {
            var products:any[] = [];
            this.productServiceApi.getProducts()
            .subscribe(
                res => {
                    if(res.length>0){
                        for(var i = 0;i < res.length; i++) {
                            products.push({
                                Id: this.newGuid(),
                                ServerId: res[i].id,
                                Name: res[i].name
                            });
                        }
                        this.productRepoApi.delete();
                        this.productRepoApi.insert(products);
                    }
                    console.log(JSON.stringify(products));
                    // this.productRepoApi.listProducts().then((data) => {
                    //     for(var i = 0; i<data.results.length;i++){
                    //         console.log(data.results[i].Name);
                    //     }
                    // });
                },err => {
                console.log(err);
                return;
            });
    }

    downloadFormsApi() {
        var forms:any[] = [];
        this.formServiceApi.getForms()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++) {
                    if(res.length>0){
                        forms.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            Title: res[i].title,
                            Description: res[i].description,
                            Fields: res[i].fields
                        });
                     }
                    this.formRepoApi.delete();
                    this.formRepoApi.insert(forms);
                }
            },err => {
            console.log(err);
            return;
        });
    }

    downloadPlacesApi() {
        this.placesTemp = [];
        this.placeServiceApi.getPlaces()
        .subscribe(
            res => {
                if(res.length>0){
                        for(var i = 0;i < res.length; i++) {
                            this.placesTemp.push({
                                Id: this.newGuid(),
                                ServerId: res[i].id,
                                StatusId: res[i].statusId,
                                Name: res[i].name,
                                StreetAddress: res[i].streetAddress,    
                                Email: res[i].email,
                                WebSite: res[i].webSite,
                                ContactName: res[i].contactName,
                                ContactTitle: res[i].contactTitle,
                                Phone: res[i].phone,
                                CellPhone: res[i].cellPhone,
                                Latitude :  res[i].latitude,
                                Longitude : res[i].longitude,
                                IsSynched: 1,
                                repoId : res[i].repoId
                            });
                        }
                        this.placeRepoApi.delete();
                        this.placeRepoApi.insert(this.placesTemp);
                }
            },err => {
            console.log(err);
            return;
        });
    }

    

    downloadRetailAuditFormsApi() {
        var retailAuditForms:any[] = [];
        this.retailAuditFormServiceApi.getRetailAuditForms()
        .subscribe(
            res => {
                if(res.length>0){
                    for(var i = 0;i < res.length; i++) {
                        retailAuditForms.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            Name: res[i].name,
                            Description: res[i].description,
                            Available: res[i].available,
                            Promoted: res[i].promoted,
                            Price: res[i].price,
                            StockLevel: res[i].stockLevel,
                            Note: res[i].note,
                            Fields: res[i].fields
                        });
                    }
                    this.retailAuditFormRepApi.delete();
                    this.retailAuditFormRepApi.insert(retailAuditForms);
                }
            },err => {
            console.log(err);
            return;
        });
    }

    downloadScheduleApi() {
        var schedules:any[] = [];
        this.scheduleServiceApi.getSchedules()
        .subscribe(
            res => {
                if(res.length>0) {
                    for(var i = 0;i < res.length; i++) {
                        schedules.push({
                                Id: this.newGuid(),
                                ServerId: res[i].id,
                                PlaceId: res[i].placeId,
                                PlaceName : res[i].place.name,
                                PlaceAddress : res[i].place.streetAddress,
                                UserId: res[i].userId,
                                VisitDate: res[i].visitDate,
                                VisitTime: res[i].visitTime,
                                VisitNote: res[i].visitNote,
                                IsRecurring: res[i].isRepeat,
                                RepeatCycle: res[i].repeatCycle,
                                IsScheduled: res[i].isScheduled,
                                IsVisited: res[i].isVisited,
                                IsMissed: res[i].isMissed,
                                IsUnScheduled: res[i].isUnScheduled,
                                Latitude: res[i].place.latitude,
                                Longitude : res[i].place.longitude,
                                VisitStatus: res[i].visitStatus,
                                IsSynched: 1,
                                repoId : res[i].repoId
                         });
                    }
                    this.scheduleTemp = schedules;
                    this.scheduleRepoApi.delete();
                    this.scheduleRepoApi.insert(schedules);
                    this.uploadPhotosToServer();
                    this.uploadFormValuesToServer();
                }
            },err => {
            console.log(err);
            return;
        });
    }
   

    downloadStatusApi() {
        var status:any[] = [];
        this.statusServiceApi.getStatuses()
        .subscribe(
            res => {
                if(res.length>0){
                    for(var i = 0;i < res.length; i++) {
                        status.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            Name: res[i].name
                        });
                    }
                
                    this.statusRepoApi.delete();
                    this.statusRepoApi.insert(status);
                }
            },err => {
            console.log(err);
            return;
        });
    }

    downloadUserApi() {
        var user:any[] = [];
        this.userServiceApi.getUsers()
        .subscribe(
            res => {
                if(res.length>0){
                    for(var i = 0;i < res.length; i++) {
                        user.push({
                            Id: res[i].id,
                            FirstName: res[i].firstName,
                            Surname: res[i].surname
                        });
                    }
                
                    this.userRepoApi.delete();
                    this.userRepoApi.insert(user);
                }
               
            },err => {
            console.log(err);
            return;
        });
    }

    downloadServerData() {
        this.syncPlaceWithServer();
        // this.syncScheduleWithServer();
        this.downloadUserApi();
        this.downloadStatusApi();
        //this.downloadPlacesApi();
        this.downloadProductsApi();
        this.downloadRetailAuditFormsApi();
        this.downloadFormsApi();
    }

    uploadFormValuesToServer() {
        let formValues = [];
        this.formValueRepoApi.listUnSynched().then((res) => {
            for(var i = 0; i<res.results.length;i++) {
                formValues.push({
                    id : 0,
                    syncId : res.results[i].Id,
                    placeId : parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    formId : res.results[i].FormId,
                    formFieldValues : JSON.stringify(JSON.parse(res.results[i].FormFieldValues)),
                    scheduleId : parseInt(this.parseScheduleId(res.results[i].ScheduleId))
                });
            }

            this.formValueServiceApi.addFormValueList(formValues)
            .subscribe(
              res => {
                console.log(JSON.stringify(res));
                this.formValueRepoApi.updateSynched(res);
              },err => {
                console.log(err);
                return;
           });
        });
    }

    uploadPhotosToServer() {
        let photoValues = [];
        this.photoRepoApi.listUnSynched().then((res) => {
            for(var i = 0; i<res.results.length; i++) {
                    photoValues.push({
                        id : 0,
                        syncId : res.results[i].Id,
                        pictureUrl : res.results[i].PictureUrl,
                        note : res.results[i].Note,
                        placeId : parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                        scheduleId : parseInt(this.parseScheduleId(res.results[i].ScheduleId))
                    });
            }
            this.photoServiceAPi.addPhotoList(photoValues)
            .subscribe(
              res => {
                this.photoRepoApi.updateSynched(res);
              },err => {
                console.log(err);
                return;
           });
        });
    }

    syncPlaceWithServer(){
        let places = [];
        this.placeRepoApi.listUnSynched().then((res) => {
            for(var i = 0; i<res.results.length;i++) {
                places.push({
                    id : parseInt(res.results[i].ServerId),
                    syncId : res.results[i].Id,
                    name : res.results[i].Name,
                    streetAddress : res.results[i].StreetAddress,
                    statusId : res.results[i].StatusId,
                    email : res.results[i].Email,
                    webSite : res.results[i].WebSite,
                    contactName : res.results[i].ContactName,
                    contactTitle : res.results[i].ContactTitle,
                    phone : res.results[i].Phone,
                    cellPhone : res.results[i].CellPhone,
                    latitude : res.results[i].Latitude,
                    longitude : res.results[i].Longitude,
                    repoId : res.results[i].RepoId
                });
            }
            this.placeServiceApi.addPlaceList(places)
            .subscribe(
              res => {
                this.placeRepoApi.deleteSynched(res);
                this.downloadPlacesApi();
                this.syncScheduleWithServer();
              },err => {
                console.log(err);
                return;
           });
        });
    }

    syncScheduleWithServer() {
        let schedules = [];
        this.scheduleRepoApi.listUnSynched().then((res) => {
            for(var i = 0; i<res.results.length;i++) {
                schedules.push({
                    id : parseInt(res.results[i].ServerId),
                    syncId : res.results[i].Id,
                    placeId : parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    userId : res.results[i].UserId,
                    visitDate : res.results[i].VisitDate,
                    visitTime : this.parseDateTime(res.results[i].VisitTime),
                    visitNote : res.results[i].VisitNote,
                    isRepeat : res.results[i].IsRecurring,
                    repeatCycle : res.results[i].RepeatCycle,
                    isVisited : res.results[i].IsVisited,
                    isScheduled: res.results[i].IsScheduled,
                    isMissed : res.results[i].IsMissed,
                    isUnScheduled : res.results[i].IsUnScheduled,
                    visitStatus : res.results[i].VisitStatus,
                    checkInTime : this.parseDateTime(res.results[i].CheckInTime),
                    checkOutTime : this.parseDateTime(res.results[i].CheckOutTime),
                    repoId : res.results[i].RepoId
                });
            }
            console.log(JSON.stringify(schedules));
            this.scheduleServiceApi.addScheduleList(schedules)
            .subscribe(
              res => {
                //this.uploadPhotosToServer();  
                //this.uploadFormValuesToServer();
                this.scheduleRepoApi.deleteSynched(res);
                this.downloadScheduleApi();
              },err => {
                console.log(err);
                return;
           });
        });
    }

    parsePlaceId(repoid) {
       let placeModel =  this.placesTemp.find(place => place.repoId === repoid);
       if (placeModel !==undefined) {
           return placeModel.ServerId;
       }else{
           return repoid;
       }
    }

    parseScheduleId(repoid) {
       let scheduleModel = this.scheduleTemp.find(schedule => schedule.repoId === repoid);
       if (scheduleModel !==undefined) {
        return scheduleModel.ServerId;
        }else{
            return repoid;
        }
    }

    parseDateTime(dateTimeVar){
        if(dateTimeVar===undefined 
            || dateTimeVar===""
            || dateTimeVar==="undefined"
            || dateTimeVar==="null"
            || dateTimeVar===null){
                return null;
            }
            return dateTimeVar;
    }
   

}