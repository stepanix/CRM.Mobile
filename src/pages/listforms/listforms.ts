import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {FormServiceApi} from '../../shared/shared';
import {FormRepoApi} from '../../repos/form-repo-api';
import { FormPage } from '../form/form';


@Component({
  selector: 'page-listforms',
  templateUrl: 'listforms.html',
})
export class ListFormsPage {

  loader : any;
  forms : any[] = [];

  scheduleId : any;
  placeId : any;

  constructor(private loading: LoadingController,
    private formServiceApi : FormServiceApi,
    private fromRepoApi : FormRepoApi,
    public navCtrl: NavController, 
    public navParams: NavParams) {
        this.scheduleId = this.navParams.get('scheduleId');
        this.placeId = this.navParams.get('placeId');
  }

  ionViewDidLoad() {
    this.listFormsRepo();
     //this.listSchedule();
  }

  listSchedule() {
      if(localStorage.getItem("isOnline")==="true"){
          this.listFormsApi();
      }else{
          this.listFormsRepo();
      }
  }

  listFormsRepo() {
      this.loader = this.loading.create({
          content: 'Busy please wait...',
      });
      this.loader.present().then(() => {
              this.forms = [];
              this.fromRepoApi.list().then((res) => {
                  for(var i = 0; i<res.results.length;i++) {
                      this.forms.push({
                          id : res.results[i].ServerId,
                          title : res.results[i].Title,
                          description : res.results[i].Description
                      });
                  }
                  this.loader.dismiss();
              });
      });
  }

  listFormsApi() {
        this.loader = this.loading.create({
            content: 'Busy please wait...',
        });
        this.loader.present().then(() => {
            this.forms = [];
            this.formServiceApi.getForms()
            .subscribe(
                res => {
                   for(var i=0; i< res.length; i++) {
                        this.forms.push({
                            id:res[i].id,
                            title : res[i].title,
                            description: res[i].description
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

  openForm(item) {
        this.navCtrl.push(FormPage, {
            formId : item.id,
            placeId : this.placeId,
            scheduleId : this.scheduleId
        });
  }


}
