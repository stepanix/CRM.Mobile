import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { PhotoRepoApi } from '../../repos/photo-repo-api';
import { PlaceRepoApi } from '../../repos/place-repo-api';
import { OrderRepoApi } from '../../repos/order-repo-api';
import { ProductRetailRepoApi } from '../../repos/productretailaudit-repo-api';
import { RetailAuditFormRepoApi } from '../../repos/retailauditform-repo-api';
import { FormValueRepoApi } from '../../repos/formvalue-repo-api';
import { FormRepoApi } from '../../repos/form-repo-api';
import { NoteRepoApi } from '../../repos/note-repo-api';
import { ScheduleRepoApi } from '../../repos/schedule-repo-api';

import * as moment from 'moment';

import { FilterPage } from '../filter/filter';
import { PhotoPage } from '../photo/photo';
import { NotePage } from '../note/note';
import { FormPage } from '../form/form';
import { RetailAuditFormPage } from '../retailauditform/retailauditform';
import { ListProductPage } from '../listproduct/listproduct';
import { OrdersPage } from '../orders/orders';

@Component({
  selector: 'page-activityhistory',
  templateUrl: 'activityhistory.html',
})
export class ActivityhistoryPage {

  photos: any[] = [];
  places: any[] = [];
  orders: any[] = [];
  audits: any[] = [];
  retailAuditForms: any[] = [];
  forms: any[] = [];
  formValues: any[] = [];
  activities: any[] = [];
  activitiesTemp: any[] = [];
  notes: any[] = [];
  loader: any;
  filterData: any = {};

  constructor(public modalCtrl: ModalController,
    private loading: LoadingController,
    private noteRepoApi: NoteRepoApi,
    private activityRepoApi: ActivityRepoApi,
    private formRepoApi: FormRepoApi,
    private formValueRepoApi: FormValueRepoApi,
    private retailAuditFormRepoApi: RetailAuditFormRepoApi,
    private productRetailAudit: ProductRetailRepoApi,
    private orderRepoApi: OrderRepoApi,
    private placeRepoApi: PlaceRepoApi,
    private photoRepoApi: PhotoRepoApi,
    private scheduleRepoApi: ScheduleRepoApi,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  navigatePage(type, logId, item) {
    if (type === "Forms") {
      this.navCtrl.setRoot(FormPage, {
        Id: logId,
        placeName: item.placeName,
        placeId: item.placeId
      });
    }
    if (type === "Product Retail Audit") {
      this.navCtrl.setRoot(RetailAuditFormPage, {
        Id: logId,
        placeName: item.placeName,
        placeId: item.placeId
      });
    }
    if (type === "Photos") {
      this.navCtrl.setRoot(PhotoPage, {
        Id: logId,
        placeName: item.placeName,
        placeId: item.placeId
      });
    }
    if (type === "Notes") {
      this.navCtrl.setRoot(NotePage, {
        Id: logId,
        placeName: item.placeName,
        placeId: item.placeId
      });
    }
    if (type === "Orders") {
      this.navCtrl.push(OrdersPage, {
        Id: logId,
        orderId: logId,
        placeName: item.placeName,
        placeId: item.placeId
      });
    }
  }

  listPlaceRepo() {
    this.placeRepoApi
      .getPlaceForActivity()
      .then((res) => {
        if (res.results.length > 0) {
          this.places = res.results;
        }
        this.listOrderRepo();
      });
  }

  listOrderRepo() {
    this.loader.present().then(() => {
      this.orderRepoApi
        .getOrderForActivity()
        .then((res) => {
          if (res.results.length > 0) {
            this.orders = res.results;
          }
          this.listPhotoRepo();
        });
    });
  }

  listPhotoRepo() {
    this.photoRepoApi
      .getPhotoForActivity()
      .then((res) => {
        if (res.results.length > 0) {
          this.photos = res.results;
        }
        this.listRetailAuditFormRepo();
      });
  }

  listRetailAuditFormRepo() {
    this.retailAuditFormRepoApi
      .list()
      .then((res) => {
        if (res.results.length > 0) {
          this.retailAuditForms = res.results;
        }
        this.listAuditRepo();
      });
  }

  listAuditRepo() {
    this.productRetailAudit
      .list()
      .then((res) => {
        if (res.results.length > 0) {
          this.audits = res.results;
        }
        this.listFormRepo();
      });
  }

  listFormRepo() {
    this.formRepoApi
      .list()
      .then((res) => {
        if (res.results.length > 0) {
          this.forms = res.results;
        }
        this.listFormValueRepo();
      });
  }

  listFormValueRepo() {
    this.formValueRepoApi
      .list()
      .then((res) => {
        if (res.results.length > 0) {
          this.formValues = res.results;
        }
        this.listNoteRepo();
      });
  }

  listNoteRepo() {
    this.noteRepoApi
      .list()
      .then((res) => {
        if (res.results.length > 0) {
          this.notes = res.results;
        }
        this.getActivityLog();
      });
  }

  getActivityLog() {
    this.filterData.selectedModule = "all";
    this.filterData.dtoPlaceId = 0;
    this.activitiesTemp = [];
    this.activityRepoApi.listAll().then((res) => {
      for (var i = 0; i < res.results.length; i++) {
        this.activitiesTemp.push({
          ActivityTypeId: res.results[i].ActivityTypeId,
          fullName: res.results[i].FullName,
          initial: this.parseInitial(res.results[i].FullName),
          placeId: parseInt(res.results[i].PlaceId),
          placeName: res.results[i].PlaceName,
          address: this.getPlace(parseInt(res.results[i].PlaceId)),
          ActivityLog: res.results[i].ActivityLog,
          photoImage: this.getPhoto(res.results[i].ActivityTypeId),
          order: this.getOrder(res.results[i].ActivityTypeId),
          retailAudit: this.getProductAudit(res.results[i].ActivityTypeId),
          form: this.getFormValues(res.results[i].ActivityTypeId),
          note: this.getNote(res.results[i].ActivityTypeId),
          DateCreated: moment(res.results[i].DateCreated).format("lll")
        });
      }
      this.appyModuleFilter();
      this.loader.dismiss();
    });
  }

  ionViewDidLoad() {

  }

  parseInitial(fullname: string): string {
      var tempName: string[] = fullname.split(" ");
      return tempName[0].charAt(0) + tempName[1].charAt(0);
  }

  getNote(repoId) {
    let itemModel = this.notes.find(item => item.Id === repoId);
    if (itemModel === undefined) {
      return "";
    } else {
      return itemModel.Description;
    }
  }

  getFormValues(repoId) {
    let itemModel = this.formValues.find(item => item.Id === repoId);
    if (itemModel === undefined) {
      return "";
    } else {
      return this.getForm(itemModel.FormId);
    }
  }

  getForm(formId) {
    let itemModel = this.forms.find(item => item.ServerId === formId);
    if (itemModel === undefined) {
      return "";
    } else {
      return itemModel.Title;
    }
  }

  getProductAudit(repoId) {
    let itemModel = this.audits.find(item => item.Id === repoId);
    if (itemModel === undefined) {
      return "";
    } else {
      return this.getAuditForm(itemModel.RetailAuditFormId);
    }
  }

  getAuditForm(formId) {
    let itemModel = this.retailAuditForms.find(item => item.ServerId === formId);
    if (itemModel === undefined) {
      return "";
    } else {
      return itemModel.Name;
    }
  }

  getPhoto(photoId) {
    let itemModel = this.photos.find(item => item.Id === photoId);
    if (itemModel === undefined) {
      return "";
    } else {
      return itemModel.PictureUrl;
    }
  }

  getOrder(orderId) {
    let itemModel = this.orders.find(item => item.RepoId === orderId);
    if (itemModel === undefined) {
      return "";
    } else {
      return itemModel.TotalAmount;
    }
  }

  getPlace(placeId) {
    let itemModel = this.places.find(item => item.ServerId === placeId);
    if (itemModel === undefined) {
      return "";
    } else {
      return itemModel.StreetAddress;
    }
  }

  ngAfterContentInit() {
    this.loader = this.loading.create({
      content: 'Busy please wait...',
    });
    this.listPlaceRepo();
  }

  toggleMenu() {
    let filterModal = this.modalCtrl.create(FilterPage);
    filterModal.present();
    filterModal.onDidDismiss(data => {
      this.filterData = data;
      //console.log("Data =>", data)
      this.appyModuleFilter();
    });
  }

  appyModuleFilter() {
    this.activities = [];
    if (this.filterData.selectedModule === "all" && this.filterData.dtoPlaceId === 0) {
      this.activities = this.activitiesTemp;
    }
    if (this.filterData.selectedModule !== "all" && this.filterData.dtoPlaceId === 0) {
      this.activitiesTemp.forEach(entry => {
        if (entry.ActivityLog === this.filterData.selectedModule
          && (moment(entry.DateCreated).format("YYYY-MM-DD") >= moment(this.filterData.dateFrom).format("YYYY-MM-DD")
            && moment(entry.DateCreated).format("YYYY-MM-DD") <= moment(this.filterData.dateTo).format("YYYY-MM-DD"))) {

          this.activities.push({
            ActivityTypeId: entry.ActivityTypeId,
            fullName: entry.fullName,
            initial: this.parseInitial(entry.fullName),
            placeId: parseInt(entry.placeId),
            placeName: entry.placeName,
            address: this.getPlace(parseInt(entry.placeId)),
            ActivityLog: entry.ActivityLog,
            photoImage: this.getPhoto(entry.ActivityTypeId),
            order: this.getOrder(entry.ActivityTypeId),
            retailAudit: this.getProductAudit(entry.ActivityTypeId),
            form: this.getFormValues(entry.ActivityTypeId),
            note: this.getNote(entry.ActivityTypeId),
            DateCreated: moment(entry.DateCreated).format("lll")
          });
        }
      });
    }

    if (this.filterData.selectedModule !== "all" && this.filterData.dtoPlaceId > 0) {
      this.activitiesTemp.forEach(entry => {
        if (entry.ActivityLog === this.filterData.selectedModule && entry.placeId === this.filterData.dtoPlaceId
          && (moment(entry.DateCreated).format("YYYY-MM-DD") >= moment(this.filterData.dateFrom).format("YYYY-MM-DD")
            && moment(entry.DateCreated).format("YYYY-MM-DD") <= moment(this.filterData.dateTo).format("YYYY-MM-DD"))) {
          
              this.activities.push({
                ActivityTypeId: entry.ActivityTypeId,
                fullName: entry.fullName,
                initial: this.parseInitial(entry.fullName),
                placeId: parseInt(entry.placeId),
                placeName: entry.placeName,
                address: this.getPlace(parseInt(entry.placeId)),
                ActivityLog: entry.ActivityLog,
                photoImage: this.getPhoto(entry.ActivityTypeId),
                order: this.getOrder(entry.ActivityTypeId),
                retailAudit: this.getProductAudit(entry.ActivityTypeId),
                form: this.getFormValues(entry.ActivityTypeId),
                note: this.getNote(entry.ActivityTypeId),
                DateCreated: moment(entry.DateCreated).format("lll")
              });
        }
      });
    }

    if (this.filterData.selectedModule === "all" && this.filterData.dtoPlaceId > 0) {
      this.activitiesTemp.forEach(entry => {
        if (entry.placeId === this.filterData.dtoPlaceId
          && (moment(entry.DateCreated).format("YYYY-MM-DD") >= moment(this.filterData.dateFrom).format("YYYY-MM-DD")
            && moment(entry.DateCreated).format("YYYY-MM-DD") <= moment(this.filterData.dateTo).format("YYYY-MM-DD"))) {
              this.activities.push({
                ActivityTypeId: entry.ActivityTypeId,
                fullName: entry.fullName,
                initial: this.parseInitial(entry.fullName),
                placeId: parseInt(entry.placeId),
                placeName: entry.placeName,
                address: this.getPlace(parseInt(entry.placeId)),
                ActivityLog: entry.ActivityLog,
                photoImage: this.getPhoto(entry.ActivityTypeId),
                order: this.getOrder(entry.ActivityTypeId),
                retailAudit: this.getProductAudit(entry.ActivityTypeId),
                form: this.getFormValues(entry.ActivityTypeId),
                note: this.getNote(entry.ActivityTypeId),
                DateCreated: moment(entry.DateCreated).format("lll")
              });
        }
      });
    }
    console.log("activities Temp", this.filterData);
    console.log("activities Temp", this.activitiesTemp);
  }

}
