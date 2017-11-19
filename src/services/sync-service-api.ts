import { Injectable } from "@angular/core";
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map'
import { ProductServiceApi, FormServiceApi, ScheduleServiceApi, UserServiceApi, PhotoServiceApi } from '../shared/shared';
import { PlaceServiceApi, RetailAuditFormServiceApi, StatusServiceApi, OrderServiceApi, OrderItemServiceApi } from '../shared/shared';
import { NoteServiceApi, ProductRetailAuditServiceApi, FormValueServiceApi, ActivityServiceApi,TimeMileageServiceApi } from '../shared/shared';
import { ProductRepoApi } from '../repos/product-repo-api';
import { FormRepoApi } from '../repos/form-repo-api';
import { PlaceRepoApi } from '../repos/place-repo-api';
import { RetailAuditFormRepoApi } from '../repos/retailauditform-repo-api';
import { ScheduleRepoApi } from '../repos/schedule-repo-api';
import { StatusRepoApi } from '../repos/status-repo-api';
import { UserRepoApi } from '../repos/user-repo-api';
import { FormValueRepoApi } from '../repos/formvalue-repo-api';
import { PhotoRepoApi } from '../repos/photo-repo-api';
import { NoteRepoApi } from '../repos/note-repo-api';
import { ProductRetailRepoApi } from '../repos/productretailaudit-repo-api';
import { ActivityRepoApi } from '../repos/activity-repo-api';
import { OrderRepoApi } from '../repos/order-repo-api';
import { OrderItemRepoApi } from '../repos/orderitem-repo-api';
import { TimeMileageRepoApi } from '../repos/timemileage-repo-api';

import * as moment from 'moment';

@Injectable()
export class SyncServiceApi {

    placesTemp: any[] = [];
    scheduleTemp: any[] = [];
    ordersTemp: any[];

    constructor(private ev: Events,
        private timeMileageServiceApi : TimeMileageServiceApi,
        private timeMileageRepoApi : TimeMileageRepoApi,
        private orderItemServiceApi: OrderItemServiceApi,
        private orderItemRepoApi: OrderItemRepoApi,
        private orderServiceApi: OrderServiceApi,
        private orderRepoApi: OrderRepoApi,
        private activityServiceApi: ActivityServiceApi,
        private activityRepoApi: ActivityRepoApi,
        private productRetailAuditServiceApi: ProductRetailAuditServiceApi,
        private productRetailRepoApi: ProductRetailRepoApi,
        private noteRepoApi: NoteRepoApi,
        private noteServiceApi: NoteServiceApi,
        private photoServiceAPi: PhotoServiceApi,
        private photoRepoApi: PhotoRepoApi,
        private formValueServiceApi: FormValueServiceApi,
        private formValueRepoApi: FormValueRepoApi,
        private userRepoApi: UserRepoApi,
        private statusRepoApi: StatusRepoApi,
        private statusServiceApi: StatusServiceApi,
        private scheduleRepoApi: ScheduleRepoApi,
        private scheduleServiceApi: ScheduleServiceApi,
        private retailAuditFormRepApi: RetailAuditFormRepoApi,
        private retailAuditFormServiceApi: RetailAuditFormServiceApi,
        private userServiceApi: UserServiceApi,
        private placeServiceApi: PlaceServiceApi,
        private placeRepoApi: PlaceRepoApi,
        private formRepoApi: FormRepoApi,
        private formServiceApi: FormServiceApi,
        private productRepoApi: ProductRepoApi,
        private productServiceApi: ProductServiceApi) {
    }

    newGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    downloadProductsApi() {
        var products: any[] = [];
        this.productServiceApi.getProducts()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        products.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            Name: res[i].name,
                            Price: res[i].price,
                            EanCode:res[i].eanCode
                        });
                    }
                    this.productRepoApi.delete();
                    this.productRepoApi.insert(products);
                }
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadFormsApi() {
        var forms: any[] = [];
        this.formServiceApi.getForms()
            .subscribe(
            res => {
                for (var i = 0; i < res.length; i++) {
                    if (res.length > 0) {
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
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadPlacesApi() {
        this.placesTemp = [];
        this.placeServiceApi.getPlaces()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
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
                            Latitude: res[i].latitude,
                            Longitude: res[i].longitude,
                            IsSynched: 1,
                            repoId: res[i].repoId
                        });
                    }
                    this.placeRepoApi.delete();
                    this.placeRepoApi.insert(this.placesTemp);
                }
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadOrdersApi() {
        this.ordersTemp = [];
        this.orderServiceApi.getOrders()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        this.ordersTemp.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            PlaceId: res[i].placeId,
                            ScheduleId: res[i].scheduleId,
                            Quantity: res[i].quantity,
                            Amount: res[i].amount,
                            DiscountRate: res[i].discountRate,
                            DiscountAmount: res[i].discountAmount,
                            TaxRate: res[i].taxRate,
                            TaxAmount: res[i].taxAmount,
                            TotalAmount: res[i].totalAmount,
                            OrderDate: res[i].orderDate,
                            DueDays: res[i].dueDays,
                            DueDate: res[i].dueDate,
                            Note: res[i].note,
                            Signature: res[i].signature,
                            IsSynched: 1,
                            repoId: res[i].repoId,
                            ScheduleRepoId : res[i].repoId,
                            Submitted : 2
                        });
                    }
                    this.orderRepoApi.delete();
                    this.orderRepoApi.insert(this.ordersTemp);
                    this.uploadOrderItemsToServer();
                    //console.log("ordrstemp",this.ordersTemp);
                }
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadRetailAuditFormsApi() {
        var retailAuditForms: any[] = [];
        this.retailAuditFormServiceApi.getRetailAuditForms()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
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
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadScheduleApi() {
        var schedules: any[] = [];
        this.scheduleServiceApi.getSchedules()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        schedules.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            PlaceId: res[i].placeId,
                            PlaceName: res[i].place.name,
                            PlaceAddress: res[i].place.streetAddress,
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
                            Longitude: res[i].place.longitude,
                            VisitStatus: res[i].visitStatus,
                            CheckInTime : res[i].checkInTime,
                            CheckOutTime : res[i].checkOutTime,
                            CheckInDistance : res[i].checkInDistance,
                            CheckOutDistance : res[i].checkOutDistance,
                            IsSynched: 1,
                            repoId: res[i].repoId
                        });
                    }
                    this.scheduleTemp = schedules;
                    this.scheduleRepoApi.delete();
                    this.scheduleRepoApi.insert(schedules);
                    this.uploadPhotosToServer();
                    this.uploadFormValuesToServer();
                    this.uploadNotesToServer();
                    this.uploadProductRetailAuditToServer();
                    this.uploadActivityToServer();
                    this.uploadOrdersToServer();
                }
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadStatusApi() {
        var status: any[] = [];
        this.statusServiceApi.getStatuses()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        status.push({
                            Id: this.newGuid(),
                            ServerId: res[i].id,
                            Name: res[i].name
                        });
                    }

                    this.statusRepoApi.delete();
                    this.statusRepoApi.insert(status);
                }
            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadUserApi() {
        let users: any[] = [];
        this.userServiceApi.getUsers()
            .subscribe(
            res => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        users.push({
                            Id: res[i].id,
                            FirstName: res[i].firstName,
                            Surname: res[i].surname
                        });
                    }

                    this.userRepoApi.delete();
                    this.userRepoApi.insert(users);
                }

            }, err => {
                //console.log(err);
                return;
            });
    }

    downloadServerData() {
        this.downloadProductsApi();
        this.syncPlaceWithServer();
        this.downloadUserApi();
        this.downloadStatusApi();        
        this.downloadRetailAuditFormsApi();
        this.downloadFormsApi();
        this.uploadTimeMileageToServer();
    }

    uploadProductRetailAuditToServer() {
        let formValues = [];
        this.productRetailRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                formValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    retailAuditFormId: res.results[i].RetailAuditFormId,
                    retailAuditFormFieldValues: JSON.stringify(JSON.parse(res.results[i].RetailAuditFormFieldValues)),
                    scheduleId: parseInt(this.parseScheduleId(res.results[i].ScheduleId)),
                    isSaved: true,
                    available: res.results[i].Available,
                    promoted: res.results[i].Promoted,
                    price: res.results[i].Price,
                    stockLevel: res.results[i].StockLevel,
                    note: res.results[i].Note,
                    repoId : res.results[i].RepoId
                });
            }
            this.productRetailAuditServiceApi.addProductRetailAuditList(formValues)
                .subscribe(
                res => {
                    this.productRetailRepoApi.updateSynched(res);
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    uploadFormValuesToServer() {
        let formValues = [];
        this.formValueRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                formValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    formId: res.results[i].FormId,
                    formFieldValues: JSON.stringify(JSON.parse(res.results[i].FormFieldValues)),
                    scheduleId: parseInt(this.parseScheduleId(res.results[i].ScheduleId)),
                    repoId : res.results[i].RepoId
                });
            }
            this.formValueServiceApi.addFormValueList(formValues)
                .subscribe(
                res => {
                    this.formValueRepoApi.updateSynched(res);
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    uploadTimeMileageToServer() {
        let timeMileagevalues = [];
        this.timeMileageRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                timeMileagevalues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    userId: res.results[i].UserId,
                    startTime: res.results[i].StartTime,
                    endTime: res.results[i].EndTime,
                    duration : res.results[i].Duration,
                    mileage : res.results[i].Mileage,
                    dateCreated : res.results[i].DateCreated
                });
            }
            //console.log("timemileage",JSON.stringify(timeMileagevalues));
            this.timeMileageServiceApi.addTimeMileageList(timeMileagevalues)
                .subscribe(
                res => {
                    this.timeMileageRepoApi.updateSynched(res);
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    uploadPhotosToServer() {
        let photoValues = [];
        this.photoRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                photoValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    pictureUrl: res.results[i].PictureUrl,
                    note: res.results[i].Note,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    scheduleId: parseInt(this.parseScheduleId(res.results[i].ScheduleId)),
                    repoId : res.results[i].RepoId
                });
            }
            this.photoServiceAPi.addPhotoList(photoValues)
                .subscribe(
                res => {
                    this.photoRepoApi.updateSynched(res);
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    uploadOrdersToServer() {
        let orderValues = [];
        this.orderRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                orderValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    repoId: res.results[i].RepoId,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    scheduleId: parseInt(this.parseScheduleId(res.results[i].ScheduleId)),
                    quantity: parseInt(res.results[i].Quantity),
                    amount: parseFloat(res.results[i].Amount),
                    discountRate: parseFloat(res.results[i].DiscountRate),
                    discountAmount: parseFloat(res.results[i].DiscountAmount),
                    taxRate: parseFloat(res.results[i].TaxRate),
                    taxAmount: parseFloat(res.results[i].TaxAmount),
                    totalAmount: parseFloat(res.results[i].TotalAmount),
                    orderDate: res.results[i].OrderDate,
                    dueDays: parseInt(res.results[i].DueDays),
                    dueDate: res.results[i].DueDate,
                    note: res.results[i].Note,
                    signature: res.results[i].Signature
                });
            }
            //console.log("OrderListValues ",JSON.stringify(orderValues));
            this.orderServiceApi.addOrderList(orderValues)
                .subscribe(
                res => {
                    this.orderRepoApi.updateSynched(res);
                    this.downloadOrdersApi();
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    uploadOrderItemsToServer() {
        let orderItemValues = [];
        let orderRepoId = "";
        this.orderItemRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                orderRepoId = res.results[i].OrderId;
                orderItemValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    orderId: parseInt(this.parseOrderId(res.results[i].OrderId)),
                    productId: parseInt(res.results[i].ProductId),
                    quantity: parseInt(res.results[i].Quantity),
                    amount: parseFloat(res.results[i].Amount),
                    repoId : res.results[i].OrderId
                });
            }
            this.orderItemServiceApi.addOrderList(orderItemValues)
                .subscribe(
                res => {
                    this.orderItemRepoApi.updateSynched(res,orderRepoId);
                }, err => {
                    return;
                });
        });
    }

    uploadNotesToServer() {
        let noteValues = [];
        this.noteRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                noteValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    description: res.results[i].Description,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    scheduleId: parseInt(this.parseScheduleId(res.results[i].ScheduleId)),
                    repoId : res.results[i].RepoId
                });
            }
            this.noteServiceApi.addNoteList(noteValues)
                .subscribe(
                res => {
                    this.noteRepoApi.updateSynched(res);
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    uploadActivityToServer() {
        let activityValues = [];
        this.activityRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                activityValues.push({
                    id: 0,
                    syncId: res.results[i].Id,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    activityLog: res.results[i].ActivityLog,
                    activityTypeId : res.results[i].ActivityTypeId,
                    dateCreated: res.results[i].DateCreated
                });
            }
            //console.log(JSON.stringify(activityValues));
            this.activityServiceApi.addActivityList(activityValues)
                .subscribe(
                res => {
                    this.activityRepoApi.updateSynched(res);
                    this.downloadActivity();
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    downloadActivity() {
        let activities : any[] = [];
        let produtctRetailDtoIn : any[] = [];
        let noteDtoIn : any[] = [];
        let formDtoIn : any[] = [];
        let orderDtoIn : any[] = [];
        let orderItemDtoIn : any[] = [];
        let photoDtoIn : any[] = [];
        this.activityRepoApi.delete();
       
        this.activityServiceApi.getActivitiesRepSummary()        
        .subscribe(
        res => {
            if (res.length > 0) {
                
                this.productRetailRepoApi.deleteSubmitted();
                this.noteRepoApi.deleteSubmitted();
                this.formValueRepoApi.deleteSubmitted();
                this.orderRepoApi.deleteSubmitted();
                this.orderItemRepoApi.deleteSubmitted();
                this.photoRepoApi.deleteSubmitted();

                for (let i = 0; i < res.length; i++) {
                    
                    if(res[i].activityLog==="Product Retail Audit") {
                        if(res[i].productRetailAudit != null){
                            produtctRetailDtoIn.push({
                                Id : res[i].activityTypeId,                   
                                ServerId : res[i].productRetailAudit.id,
                                PlaceId : res[i].productRetailAudit.placeId,
                                RetailAuditFormId : res[i].productRetailAudit.retailAuditFormId,
                                ScheduleId : res[i].productRetailAudit.scheduleId,
                                RetailAuditFormFieldValues :  JSON.stringify(JSON.parse(res[i].productRetailAudit.retailAuditFormFieldValues)),
                                IsSaved : 1,
                                IsSynched : 1,
                                Available : res[i].productRetailAudit.available,
                                Promoted : res[i].productRetailAudit.promoted,
                                Price  : res[i].productRetailAudit.price,
                                StockLevel :  res[i].productRetailAudit.stockLevel,
                                Note : res[i].productRetailAudit.note,
                                Submitted : 2
                            });
                        }
                       
                    }
                    
                    if(res[i].activityLog==="Notes") {
                        if(res[i].note != null){
                            noteDtoIn.push({
                                Id : res[i].activityTypeId,
                                ServerId : res[i].note.id,
                                PlaceId : res[i].note.placeId,
                                ScheduleId : res[i].note.scheduleId,
                                Description : res[i].note.description,
                                IsSynched : 1,
                                Submitted : 2
                            });
                        }
                    }

                    if(res[i].activityLog==="Forms") {
                        if(res[i].formValue != null){
                            formDtoIn.push({
                                Id : res[i].activityTypeId,
                                ServerId : res[i].formValue.id,
                                PlaceId : res[i].formValue.placeId,
                                FormId : res[i].formValue.formId,
                                ScheduleId : res[i].formValue.scheduleId,
                                FormFieldValues : JSON.stringify(JSON.parse(res[i].formValue.formFieldValues)),
                                IsSynched : 1,
                                Submitted : 2
                              });
                        }
                    }

                    if(res[i].activityLog==="Orders") {
                        if(res[i].order !== null){
                            orderDtoIn.push({
                                Id : res[i].activityTypeId,
                                ServerId : res[i].order.id,
                                PlaceId : res[i].order.placeId,
                                ScheduleId : res[i].order.scheduleId,
                                Quantity : res[i].order.quantity,
                                Amount : res[i].order.amount,
                                DiscountRate : res[i].order.discountRate,
                                DiscountAmount : res[i].order.discountAmount,
                                TaxRate : res[i].order.taxRate,
                                TaxAmount : res[i].order.taxAmount,
                                TotalAmount : res[i].order.totalAmount,
                                OrderDate : res[i].order.orderDate,
                                DueDays : res[i].order.dueDays,
                                DueDate : res[i].order.dueDate,
                                Note : res[i].order.note,
                                Signature : res[i].order.signature,
                                IsSynched : 1,
                                RepoId : res[i].order.repoId,
                                Submitted : 2,
                                ScheduleRepoId : res[i].order.scheduleId
                            });
                            if(res[i].order.orderItemList.length > 0){
                                for(let j=0;j<res[i].order.orderItemList.length; j++){
                                    orderItemDtoIn.push({
                                        Id : this.newGuid(),
                                        ServerId : res[i].order.orderItemList[j].id,
                                        OrderId : res[i].activityTypeId,
                                        ProductId : res[i].order.orderItemList[j].productId,
                                        Quantity : res[i].order.orderItemList[j].quantity,
                                        Amount : res[i].order.orderItemList[j].amount,
                                        IsSynched : 1,
                                        Submitted : 2,
                                        RepoId : null, 
                                    });
                                }
                            }
                        }
                    }

                    if(res[i].activityLog==="Photos") {
                        console.log(JSON.stringify(res));
                        if(res[i].photo != null){
                            photoDtoIn.push({
                                Id: res[i].activityTypeId,
                                ServerId : res[i].photo.id,
                                PlaceId : res[i].photo.placeId,
                                ScheduleId : res[i].photo.scheduleId,
                                PictureUrl : res[i].photo.pictureUrl,
                                Note : res[i].photo.note,
                                IsSynched: 1,
                                ScheduleRepoId: res[i].photo.scheduleId,
                                PlaceRepoId : null,
                                Submitted : 2,
                                RepoId : res[i].photo.repoId
                            });
                        }
                    }

                    activities.push({
                        Id: this.newGuid(),
                        FullName: res[i].user.firstName + " " + res[i].user.surname,
                        PlaceName: res[i].place.name,
                        PlaceId: res[i].placeId,
                        ActivityLog: res[i].activityLog,
                        ActivityTypeId: res[i].activityTypeId,
                        DateCreated : res[i].dateCreated,
                        IsSynched: 1,
                        Submitted : res[i].submitted
                    });
                }
                this.activityRepoApi.insert(activities);
                this.formValueRepoApi.insert(formDtoIn);
                this.noteRepoApi.insert(noteDtoIn);
                this.productRetailRepoApi.insert(produtctRetailDtoIn);
                this.orderRepoApi.insert(orderDtoIn);
                this.orderItemRepoApi.insert(orderItemDtoIn);
                this.photoRepoApi.insert(photoDtoIn);
                //this.ev.publish("downloaded",true);
            }
        }, err => {
            return;
        });
    }

    syncPlaceWithServer() {
        let places = [];
        this.placeRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                places.push({
                    id: parseInt(res.results[i].ServerId),
                    syncId: res.results[i].Id,
                    name: res.results[i].Name,
                    streetAddress: res.results[i].StreetAddress,
                    statusId: this.parseStatusId(res.results[i].StatusId),
                    email: res.results[i].Email,
                    webSite: res.results[i].WebSite,
                    contactName: res.results[i].ContactName,
                    contactTitle: res.results[i].ContactTitle,
                    phone: res.results[i].Phone,
                    cellPhone: res.results[i].CellPhone,
                    latitude: res.results[i].Latitude,
                    longitude: res.results[i].Longitude,
                    repoId: res.results[i].RepoId
                });
            }
            //console.log("places",JSON.stringify(places));
            this.placeServiceApi.addPlaceList(places)
                .subscribe(
                res => {
                    this.placeRepoApi.deleteSynched(res);
                    this.downloadPlacesApi();
                    this.syncScheduleWithServer();
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    parseStatusId(id){
        if(id===-1 || id==="-1"){
            return null;
        }else{
            return parseInt(id);
        }
    }

    syncScheduleWithServer() {
        let schedules = [];
        this.scheduleRepoApi.listUnSynched().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                schedules.push({
                    id: parseInt(res.results[i].ServerId),
                    syncId: res.results[i].Id,
                    placeId: parseInt(this.parsePlaceId(res.results[i].PlaceId)),
                    userId: res.results[i].UserId,
                    visitDate: res.results[i].VisitDate,
                    visitTime: this.parseDateTime(res.results[i].VisitTime),
                    visitNote: res.results[i].VisitNote,
                    isRepeat: res.results[i].IsRecurring,
                    repeatCycle: res.results[i].RepeatCycle,
                    isVisited: res.results[i].IsVisited,
                    isScheduled: res.results[i].IsScheduled,
                    isMissed: res.results[i].IsMissed,
                    isUnScheduled: res.results[i].IsUnScheduled,
                    visitStatus: res.results[i].VisitStatus,
                    checkInTime: this.parseDateTime(res.results[i].CheckInTime),
                    checkOutTime: this.parseDateTime(res.results[i].CheckOutTime),
                    checkInDistance : parseFloat(res.results[i].CheckInDistance),
                    checkOutDistance : parseFloat(res.results[i].CheckOutDistance),
                    repoId: res.results[i].RepoId
                });
            }
           // console.log(JSON.stringify(schedules));
            this.scheduleServiceApi.addScheduleList(schedules)
                .subscribe(
                res => {
                    this.scheduleRepoApi.deleteSynched(res);
                    this.downloadScheduleApi();
                }, err => {
                    //console.log(err);
                    return;
                });
        });
    }

    parseOrderId(repoid) {
        let orderModel = this.ordersTemp.find(orders => orders.repoId === repoid);
        //console.log("orders temp search",this.ordersTemp);
        if (orderModel !== undefined) {
            return orderModel.ServerId;
        } else {
            return repoid;
        }
    }

    parsePlaceId(repoid) {
        let placeModel = this.placesTemp.find(place => place.repoId === repoid);
        if (placeModel !== undefined) {
            return placeModel.ServerId;
        } else {
            return repoid;
        }
    }

    parseScheduleId(repoid) {
        let scheduleModel = this.scheduleTemp.find(schedule => schedule.repoId === repoid);
        if (scheduleModel !== undefined) {
            return scheduleModel.ServerId;
        } else {
            return repoid;
        }
    }

    parseDateTime(dateTimeVar) {
        if (dateTimeVar === undefined
            || dateTimeVar === ""
            || dateTimeVar === "undefined"
            || dateTimeVar === "null"
            || dateTimeVar === null) {
            return null;
        }
        return dateTimeVar;
    }


}