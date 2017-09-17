import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
       var token = localStorage.getItem('token');
        if(token===null || token===undefined || token==="null"){
            this.navCtrl.setRoot(LoginPage);
         }
  }

  ionViewDidLoad() {
    
  }

}
