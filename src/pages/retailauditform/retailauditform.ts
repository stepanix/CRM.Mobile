import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams,
    ActionSheetController, LoadingController, AlertController, ToastController
} from 'ionic-angular';
import { RetailAuditFormRepoApi } from '../../repos/retailauditform-repo-api';
import { ProductRetailRepoApi } from '../../repos/productretailaudit-repo-api';
import { ProductRepoApi } from '../../repos/product-repo-api';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActivityRepoApi } from '../../repos/activity-repo-api';

import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivitiesPage } from '../activities/activities';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
    selector: 'page-retailauditform',
    templateUrl: 'retailauditform.html',
    providers: [DatePicker]
})
export class RetailAuditFormPage {

    selectedDate: any = "Select date";
    loader: any;
    formData: any;
    formFields: any[] = [];
    formId: any;
    scheduleId: any;
    placeId: any;
    products: any[] = [];
    formFieldValues: any[] = [];
    formFieldDtoIn: any;
    formFieldModel: any[] = [];
    base64Image: string;

    showStockLevel: any;
    showNote: any;
    available: boolean = false;
    promoted: boolean = false;

    price: number = 0;
    stockLevel: number = 0;
    note: string = "";
    placeName: string;
    retailAuditFormId: string;

    isDisabled: boolean = false;
    serverRepoId: any = "";


    constructor(private barcodeScanner: BarcodeScanner,
        public toastCtrl: ToastController,
        private loading: LoadingController,
        private syncServiceApi: SyncServiceApi,
        private alertCtrl: AlertController,
        public activityRepoApi: ActivityRepoApi,
        private datePicker: DatePicker,
        private productRepoApi: ProductRepoApi,
        private retailAuditFormRepoApi: RetailAuditFormRepoApi,
        private productRetailAuditRepoApi: ProductRetailRepoApi,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        public navCtrl: NavController,
        public navParams: NavParams) {

        this.datePicker.onDateSelected.subscribe((date) => {
            for (var i = 0; i < this.formFields.length; i++) {
                if (this.formFields[i].questionTypeId === "7") {
                    this.formFieldModel[this.formFields[i].id] = moment(date).format('YYYY-MM-DD').toString();
                }
            }
        });

        this.formFieldValues = [];
        this.formFieldDtoIn = {};

        this.retailAuditFormId = this.navParams.get('Id');
        this.placeName = this.navParams.get('placeName');
        this.formId = this.navParams.get('retailFormId');
        this.placeId = this.navParams.get('placeId');
        this.scheduleId = this.navParams.get('scheduleId');

        this.listProductsRepo();

        if (this.retailAuditFormId === undefined) {
            this.getFormRepo();
        } else {
            this.getFormFieldsRepo();
        }
    }

    submitOrder() {
        let alertConfirm = this.alertCtrl.create({
            title: '',
            message: 'Are you sure you want to submit this record ? you will not be able to make changes after submitting',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Submit',
                    handler: () => {
                        this.productRetailAuditRepoApi.submit(this.retailAuditFormId);
                        this.loader = this.loading.create({
                            content: 'Submitting, please wait...',
                        });
                        this.loader.present().then(() => {
                            this.syncServiceApi.downloadServerData();
                            this.navCtrl.setRoot(ActivitiesPage);
                            this.loader.dismiss();
                        });
                    }
                }
            ]
        });
        alertConfirm.present();
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

    ionViewDidLoad() {

    }

    presentActionSheet(questionId) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Change your profile picture',
            buttons: [
                {
                    text: 'Take a picture',
                    handler: () => {
                        this.takePhoto(questionId);
                    }
                }, {
                    text: 'Select from gallery',
                    handler: () => {
                        this.selectPhoto(questionId);
                    }
                }, {
                    text: 'Cancel',
                }
            ]
        });
        actionSheet.present();
    }

    takePhoto(questionId) {
        var options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            saveToPhotoAlbum: true
        }
        this.camera.getPicture(options).then((imageData) => {
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
            this.formFieldModel[questionId] = this.base64Image;
        }, (err) => {
        });
    }

    selectPhoto(questionId) {
        let returnImage = this;

        var libOptions = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };

        this.camera.getPicture(libOptions).then((filePath) => {
            window["plugins"].Base64.encodeFile(filePath, function (base64) {
                console.log(base64);
                returnImage.base64Image = base64;
                returnImage.formFieldModel[questionId] = returnImage.base64Image;
            });

        }, (err) => {
        });
    }

    showCalendar() {
        this.datePicker.showCalendar();
    }

    saveFormFieldValues() {
        this.formFieldValues = [];
        for (var i = 0; i < this.formFields.length; i++) {
            this.formFieldValues.push({
                id: this.formFields[i].id,
                questionTypeId: this.formFields[i].questionTypeId,
                question: this.formFields[i].question,
                answer: this.formFieldModel[this.formFields[i].id]
            });
        }
    }

    prepareRepoDtoData() {
        this.saveFormFieldValues();
        this.retailAuditFormId = this.newGuid();
        this.serverRepoId = this.retailAuditFormId;
        this.formFieldDtoIn = {
            id: this.retailAuditFormId,
            PlaceId: this.placeId,
            Available: this.available,
            Promoted: this.promoted,
            Price: this.price,
            StockLevel: this.stockLevel,
            Note: this.note,
            RetailAuditFormId: this.formId,
            RetailAuditFormFieldValues: JSON.stringify(this.formFieldValues),
            ScheduleId: this.scheduleId,
            IsSynched: 0
        }
    }

    submitForm() {
        this.saveFormValuesRepo();
    }

    insertFormValuesRepo() {
        this.prepareRepoDtoData();
        this.formFieldDtoIn.RepoId = this.serverRepoId;
        this.productRetailAuditRepoApi.insertRecord(this.formFieldDtoIn);
        this.logActivityRepo();
    }

    saveFormValuesRepo() {
        if (this.retailAuditFormId === undefined) {
            this.insertFormValuesRepo();
        } else {
            this.updateFormValuesRepo();
        }
        let toast = this.toastCtrl.create({
            message: 'Record saved successfully',
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }

    updateFormValuesRepo() {
        this.saveFormFieldValues();
        this.formFieldDtoIn = {
            Id: this.retailAuditFormId,
            PlaceId: this.placeId,
            Available: this.available,
            Promoted: this.promoted,
            Price: this.price,
            StockLevel: this.stockLevel,
            Note: this.note,
            RetailAuditFormId: this.formId,
            RetailAuditFormFieldValues: JSON.stringify(this.formFieldValues),
            ScheduleId: this.scheduleId,
            IsSynched: 0
        }
        //console.log(JSON.stringify(this.formFieldDtoIn));
        this.productRetailAuditRepoApi.updateRecord(this.formFieldDtoIn);
    }

    openBarCode(questionId) {
        this.barcodeScanner.scan().then((barcode) => {
            this.formFieldModel[questionId] = barcode;
        }, (err) => {
            console.log("barcode error", err);
        });
    }

    logActivityRepo() {
        let ActivityDtoIn = {
            Id: this.serverRepoId,
            FullName: localStorage.getItem('fullname'),
            PlaceName: this.placeName,
            PlaceId: this.placeId,
            ActivityLog: 'Product Retail Audit',
            ActivityTypeId: this.retailAuditFormId,
            IsSynched: 0,
            DateCreated: moment().format().toString(),
            Submitted : 1
        }
        this.activityRepoApi.insertRecord(ActivityDtoIn);
    }

    listProductsRepo() {
        this.products = [];
        this.productRepoApi.list().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                this.products.push({
                    id: res.results[i].ServerId,
                    name: res.results[i].Name
                });
            }
        });
    }

    isFormFieldValueValid(formFieldValue): boolean {
        if (formFieldValue === undefined
            || formFieldValue === "undefined"
            || formFieldValue === "null"
            || formFieldValue === null
            || formFieldValue === "") {
            return false;
        }
        return true;
    }

    allMandatoryFieldsValidated(): boolean {
        for (var i = 0; i < this.formFields.length; i++) {
            if ((this.formFieldModel[this.formFields[i].id] === undefined
                || this.formFieldModel[this.formFields[i].id] === "undefined"
                || this.formFieldModel[this.formFields[i].id] === "null"
                || this.formFieldModel[this.formFields[i].id] === null
                || this.formFieldModel[this.formFields[i].id] === "")
                && this.isFieldMandatory(this.formFields[i])) {
                return false;
            }
        }
        return true;
    }

    isFieldMandatory(field) {
        let index: number = this.formFields.indexOf(field);
        if (index !== -1) {
            return this.formFields[index].mandatory;
        }
    }

    getFormRepo() {

        this.formFields = [];

        this.retailAuditFormRepoApi.listById(this.formId).then((res) => {

            this.showStockLevel = res.results[0].StockLevel;
            this.showNote = res.results[0].Note;

            let fields = JSON.parse(res.results[0].Fields);

            for (var i = 0; i < fields.length; i++) {
                this.formFields.push({
                    id: fields[i].id,
                    questionTypeId: fields[i].questionTypeId,
                    question: fields[i].question,
                    answers: fields[i].answers,
                    mandatory: fields[i].mandatory
                });
            }
        });

    }

    getFormFieldsRepo() {
        this.formFieldValues = [];
        this.productRetailAuditRepoApi.listByFormId(this.retailAuditFormId).then((res) => {
            this.formId = res.results[0].RetailAuditFormId;
            this.available = res.results[0].Available;
            this.promoted = res.results[0].Promoted;
            this.price = res.results[0].Price;
            this.stockLevel = res.results[0].StockLevel;
            if (res.results[0].Submitted === 1 || res.results[0].Submitted === 2) {
                this.isDisabled = true;
            }
            this.getFormRepo();
            let fields = JSON.parse(res.results[0].RetailAuditFormFieldValues);
            for (var i = 0; i < fields.length; i++) {
                this.formFieldModel[fields[i].id] = this.parseModelAnswer(fields[i].answer);
                console.log(this.formFieldModel[fields[i].id]);
            }
        });
    }

    parseModelAnswer(value) {
        if (value === undefined) {
            return "";
        } else {
            return value;
        }
    }




}
