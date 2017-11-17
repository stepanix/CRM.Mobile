import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController, AlertController, ToastController,Events } from 'ionic-angular';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms"
import { FormRepoApi } from '../../repos/form-repo-api';
import { FormValueRepoApi } from '../../repos/formvalue-repo-api';
import { ProductRepoApi } from '../../repos/product-repo-api';
import { FormServiceApi, ProductServiceApi, FormValueServiceApi } from '../../shared/shared';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivitiesPage } from '../activities/activities';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
    selector: 'page-form',
    templateUrl: 'form.html',
    providers: [DatePicker]
})

export class FormPage {

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
    placeName: string;
    formFieldId: string;

    isDisabled: boolean = false;
    serverRepoId: any = "";

    constructor(private ev: Events,private barcodeScanner: BarcodeScanner,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private syncServiceApi: SyncServiceApi,
        public activityRepoApi: ActivityRepoApi,
        private camera: Camera,
        public actionSheetCtrl: ActionSheetController,
        private loading: LoadingController,
        private formValueRepoApi: FormValueRepoApi,
        private formValueServiceApi: FormValueServiceApi,
        private productRepoApi: ProductRepoApi,
        private productServiceApi: ProductServiceApi,
        public formServiceApi: FormServiceApi,
        public formRepoApi: FormRepoApi,
        private datePicker: DatePicker,
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

        this.formFieldId = this.navParams.get('Id');
        this.placeName = this.navParams.get('placeName');
        this.formId = this.navParams.get('formId');
        this.placeId = this.navParams.get('placeId');
        this.scheduleId = this.navParams.get('scheduleId');

        this.listProductsRepo();

        if (this.formFieldId === undefined) {
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
                    text: 'Submit record',
                    handler: () => {
                        this.formValueRepoApi.submit(this.formFieldId);
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

    presentActionSheet(questionId) {
        if(this.isDisabled===true){
            return;
        }
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

    ionViewDidLoad() {
    }

    showCalendar() {
        if(this.isDisabled===true){
            return;
        }
        this.datePicker.showCalendar();
    }

    openBarCode(questionId) {
        if(this.isDisabled===true){
            return;
        }
        this.barcodeScanner.scan().then((barcode) => {
            this.formFieldModel[questionId] = barcode;
        }, (err) => {
            console.log("barcode error", err);
        });
    }

    saveFormFieldValues() {
        this.formFieldValues = [];
        for (var i = 0; i < this.formFields.length; i++) {
            let answer = "";
            if (this.isFormFieldValueValid(this.formFieldModel[this.formFields[i].id])) {
                answer = this.formFieldModel[this.formFields[i].id];
            }
            this.formFieldValues.push({
                id: this.formFields[i].id,
                questionTypeId: this.formFields[i].questionTypeId,
                question: this.formFields[i].question,
                answer: answer
            });
        }
    }

    prepareApiDtoData() {
        this.saveFormFieldValues();
        this.formFieldDtoIn = {
            id: 1,
            placeId: this.placeId,
            formId: this.formId,
            formFieldValues: JSON.stringify(this.formFieldValues),
            scheduleId: this.scheduleId
        }
    }

    prepareRepoDtoData() {
        this.saveFormFieldValues();
        this.formFieldId = this.newGuid();
        this.serverRepoId = this.formFieldId;
        this.formFieldDtoIn = {
            id: this.formFieldId,
            PlaceId: this.placeId,
            FormId: this.formId,
            FormFieldValues: JSON.stringify(this.formFieldValues),
            ScheduleId: this.scheduleId,
            IsSynched: 0
        }
    }

    submitForm() {
        this.saveFormValuesRepo();
    }

    saveFormValuesApi() {
        this.prepareApiDtoData();
        this.loader = this.loading.create({
            content: 'Busy, please wait...',
        });
        this.loader.present().then(() => {
            this.formValueServiceApi.addFormValue(this.formFieldDtoIn)
                .subscribe(
                res => {
                    this.navCtrl.pop();
                    this.loader.dismiss();
                }, err => {
                    console.log(err);
                    this.loader.dismiss();
                    return;
                });
        });
    }

    saveFormValuesRepo() {
        if (this.formFieldId === undefined) {
            this.insertFormvaluesRepo();
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

    insertFormvaluesRepo() {
        this.prepareRepoDtoData();
        this.formFieldDtoIn.RepoId = this.serverRepoId;
        this.formValueRepoApi.insertRecord(this.formFieldDtoIn);
        this.logActivityRepo();
    }

    updateFormValuesRepo() {
        this.saveFormFieldValues();
        this.formFieldDtoIn = {
            Id: this.formFieldId,
            PlaceId: this.placeId,
            FormId: this.formId,
            FormFieldValues: JSON.stringify(this.formFieldValues),
            ScheduleId: this.scheduleId,
            IsSynched: 0
        }
        this.formValueRepoApi.updateRecord(this.formFieldDtoIn);
    }

    logActivityRepo() {
        let ActivityDtoIn = {
            Id: this.serverRepoId,
            FullName: localStorage.getItem('fullname'),
            PlaceName: this.placeName,
            PlaceId: this.placeId,
            ActivityLog: 'Forms',
            ActivityTypeId: this.formFieldId,
            IsSynched: 0,
            DateCreated: moment().format().toString(),
            Submitted : 1
        }
        this.activityRepoApi.insertRecord(ActivityDtoIn);
        this.ev.publish('activity', true);
    }

    listProductsApi() {
        this.products = [];
        this.productServiceApi.getProducts()
            .subscribe(
            res => {
                for (var i = 0; i < res.length; i++) {
                    this.products.push({
                        id: res[i].id,
                        name: res[i].name
                    });
                }
            }, err => {
                console.log(err);
                return;
            });
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
        this.formRepoApi.listById(this.formId).then((res) => {
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
        this.formValueRepoApi.listByFormId(this.formFieldId).then((res) => {
            this.formId = res.results[0].FormId;
            if (res.results[0].Submitted === 1 || res.results[0].Submitted === 2) {
                this.isDisabled = true;
            }
            this.getFormRepo();
            let fields = JSON.parse(res.results[0].FormFieldValues);
            for (var i = 0; i < fields.length; i++) {
                this.formFieldModel[fields[i].id] = this.parseModelAnswer(fields[i].answer);
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
