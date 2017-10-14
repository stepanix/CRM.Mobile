import { Component } from '@angular/core';
import {  NavController, NavParams,LoadingController } from 'ionic-angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms"
import {FormRepoApi} from '../../repos/form-repo-api';
import {FormValueRepoApi} from '../../repos/formvalue-repo-api';
import {ProductRepoApi} from '../../repos/product-repo-api';
import {FormServiceApi,ProductServiceApi,FormValueServiceApi} from '../../shared/shared';
import { DatePicker } from 'ionic2-date-picker';
import * as moment from 'moment';


@Component({
    selector: 'page-form',
    templateUrl: 'form.html',
    providers: [DatePicker]
})

export class FormPage {
  
    selectedDate : any = "Select date";
    loader : any;
    formData : any;
    formFields : any[] = [];
    formId : any;
    scheduleId : any;
    placeId : any;
    products : any[] = [];
    formFieldValues : any[] = [];
    formFieldDtoIn : any;
    formFieldModel:any[] = [];

    constructor(private loading: LoadingController,
      private formValueRepoApi:FormValueRepoApi,
      private formValueServiceApi : FormValueServiceApi,
      private productRepoApi : ProductRepoApi,
      private productServiceApi : ProductServiceApi,
      public formServiceApi : FormServiceApi,
      public formRepoApi : FormRepoApi,
      private datePicker : DatePicker,
      public navCtrl : NavController,
      public navParams : NavParams) {

           this.datePicker.onDateSelected.subscribe((date) => {
                for (var i=0; i < this.formFields.length; i++) {
                    if (this.formFields[i].questionTypeId==="7") {
                       this.formFieldModel[this.formFields[i].id] = moment(date).format('YYYY-MM-DD').toString(); 
                    }
                }
           });
          
           this.formFieldValues = [];
           this.formFieldDtoIn = {};

           this.formId = this.navParams.get('formId');
           this.placeId = this.navParams.get('placeId');
           this.scheduleId = this.navParams.get('scheduleId');

           this.listProductsRepo();
           this.getFormRepo();

        //    if(localStorage.getItem("isOnline")==="true") {
        //        this.listProductsApi();
        //        this.getFormApi();
        //    }else{
        //        this.listProductsRepo();
        //        this.getFormRepo();
        //    }
     }

     newGuid() : string {
      function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
      }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

     ionViewDidLoad(){
     }

     showCalendar(){
       this.datePicker.showCalendar();
     }

     saveFormFieldValues() {
      this.formFieldValues = [];
        for(var i=0;i<this.formFields.length;i++) {
            if(this.isFormFieldValueValid(this.formFieldModel[this.formFields[i].id])) {
                this.formFieldValues.push ({
                    question : this.formFields[i].question,
                    answer : this.formFieldModel[this.formFields[i].id]
                });
            }
        }
     }

     prepareApiDtoData() {
        this.saveFormFieldValues();    
        this.formFieldDtoIn = {
            id : 1,
            placeId : this.placeId,
            formId : this.formId,
            formFieldValues : JSON.stringify(this.formFieldValues),
            scheduleId : this.scheduleId
        }
     }

     prepareRepoDtoData() {
      this.saveFormFieldValues();    
      this.formFieldDtoIn = {
          id : this.newGuid(),
          PlaceId : this.placeId,
          FormId : this.formId,
          FormFieldValues : JSON.stringify(this.formFieldValues),
          ScheduleId : this.scheduleId,
          IsSynched : 0
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
                  },err => {
                    console.log(err);
                    this.loader.dismiss();
                    return;
             });
        });
     }

     saveFormValuesRepo() {
          this.prepareRepoDtoData();
          this.loader = this.loading.create({
              content: 'Busy, please wait...',
          });
          this.loader.present().then(() => {
              this.formValueRepoApi.insertRecord(this.formFieldDtoIn);
              this.navCtrl.pop();
              this.loader.dismiss();
          });
     }

     listProductsApi() {
            this.products = [];
            this.productServiceApi.getProducts()
             .subscribe(
                res => {
                  for(var i=0; i< res.length; i++) {
                        this.products.push({
                            id:res[i].id,
                            name : res[i].name
                        });
                    }
                },err => {
                 console.log(err);
                 return;
            });
     }

     listProductsRepo() {
        this.products = [];
        this.productRepoApi.list().then((res) => {
              for(var i = 0; i<res.results.length;i++) {
                  this.products.push({
                      id : res.results[i].ServerId,
                      name : res.results[i].Name
                  });
              }
          });
     }

     isFormFieldValueValid(formFieldValue) : boolean{
        if(formFieldValue===undefined 
          || formFieldValue==="undefined"
          || formFieldValue==="null"
          || formFieldValue===null
          || formFieldValue===""){
            return false;
          }
          return true;
     }

     allMandatoryFieldsValidated() : boolean {
          for(var i=0;i<this.formFields.length;i++){
            if((this.formFieldModel[this.formFields[i].id]===undefined 
              || this.formFieldModel[this.formFields[i].id]==="undefined"
              || this.formFieldModel[this.formFields[i].id]==="null"
              || this.formFieldModel[this.formFields[i].id]===null
              || this.formFieldModel[this.formFields[i].id]==="")
              && this.isFieldMandatory(this.formFields[i])){
                return false;                 
            }
          }
          return true;
     }

     isFieldMandatory(field){
          let index: number = this.formFields.indexOf(field);
          if (index !== -1) {
              return this.formFields[index].mandatory;
          }
     }

     getFormRepo() {
        this.loader = this.loading.create({
            content: 'Busy please wait...',
        });

        this.loader.present().then(() => {
          
                this.formFields = [];

                this.formRepoApi.listById(this.formId).then((res) => {

                  let fields = JSON.parse(res.results[0].Fields);
                    
                    for(var i=0; i < fields.length; i++) {
                        this.formFields.push({
                            id : fields[i].id,
                            questionTypeId : fields[i].questionTypeId,
                            question : fields[i].question,
                            answers : fields[i].answers,
                            mandatory : fields[i].mandatory
                        });
                    }
                    this.loader.dismiss();
                });
        });
     }

     getFormApi() {

          this.loader = this.loading.create({
             content: 'Busy please wait...',
          });

          this.loader.present().then(() => {
            this.formFields = [];
            this.formServiceApi.getForm(this.formId)
            .subscribe(
                res => {
                  let fields = JSON.parse(res.fields);
                  for(var i=0; i < fields.length; i++){
                        this.formFields.push({
                            id : fields[i].id,
                            questionTypeId : fields[i].questionTypeId,
                            question : fields[i].question,
                            answers : fields[i].answers,
                            mandatory : fields[i].mandatory
                        });
                    }
                    this.loader.dismiss();
                },err => {
                  this.loader.dismiss();
                  console.log(err);
                  return;
              });
          });
       
     }

    
}
