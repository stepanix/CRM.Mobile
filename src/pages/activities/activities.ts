import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SyncServiceApi } from '../../services/sync-service-api';


@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {

  loader : any;

  constructor(private syncServiceApi: SyncServiceApi,
             private loading: LoadingController,
             public navCtrl: NavController, 
             public navParams: NavParams) {

         var token = localStorage.getItem('token');

        if(token===null || token===undefined || token==="null"){
            this.navCtrl.setRoot(LoginPage);
         }else{
            this.loader = this.loading.create({
              content: 'Synching data, please wait...',
            });

            this.loader.present().then(() => {
              syncServiceApi.downloadServerData();
              this.loader.dismiss();
            });
         }
  }

  ionViewDidLoad() {
    
  }

}
