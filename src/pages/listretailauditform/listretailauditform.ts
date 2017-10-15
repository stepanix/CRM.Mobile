import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {RetailAuditFormRepoApi} from '../../repos/retailauditform-repo-api';
import { RetailAuditFormPage } from '../retailauditform/retailauditform';


@Component({
    selector: 'page-listretailauditform',
    templateUrl: 'listretailauditform.html',
})
export class ListRetailAuditFormPage {

  loader : any;
  retailauditforms : any[] = [];

  scheduleId : any;
  placeId : any;

  constructor(private loading: LoadingController,
     private retailAuditFormRepoApi : RetailAuditFormRepoApi,
     public navCtrl: NavController, 
     public navParams: NavParams) {
      this.scheduleId = this.navParams.get('scheduleId');
      this.placeId = this.navParams.get('placeId');
      
      this.listFormsRepo();
  }

  ionViewDidLoad() {
    
  }

  listFormsRepo() {
    this.loader = this.loading.create({
        content: 'Busy please wait...',
    });
    this.loader.present().then(() => {
            this.retailauditforms = [];
            this.retailAuditFormRepoApi.list().then((res) => {
                for(var i = 0; i<res.results.length;i++) {
                    this.retailauditforms.push({
                        id : res.results[i].ServerId,
                        title : res.results[i].Name,
                        description : res.results[i].Description
                    });
                }
                this.loader.dismiss();
            });
      });
  }

  openForm(item) {
      this.navCtrl.push(RetailAuditFormPage, {
          formId : item.id,
          placeId : this.placeId,
          scheduleId : this.scheduleId
      });
  }



}
