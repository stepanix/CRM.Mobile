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
import {FormServiceApi} from '../../shared/shared';


@Component({
    selector: 'page-form',
    templateUrl: 'form.html',
})

export class FormPage {
  
    loader : any;
    formData : any;
    formFields : any[] = [];
    formId : any;

    formFieldModel:any[] = [];

    constructor(private loading: LoadingController,
      public formServiceApi:FormServiceApi,
      public formRepoApi:FormRepoApi,
      private formBuilder:FormBuilder,
      public navCtrl:NavController,
      public navParams:NavParams) {
        this.formId = this.navParams.get('formId');
        this.getFormApi();
     }

     ionViewDidLoad() {
      
     }

     submitForm(){
       for(var i=0;i<this.formFields.length;i++){
         alert(this.formFieldModel[this.formFields[i].id]);
       }
     }

     getFormRepo() {

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

    parseFormFields() {
      
    }

}
