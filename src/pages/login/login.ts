import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,MenuController,LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceApi,FormServiceApi } from '../../shared/shared';
import { ActivitiesPage } from '../activities/activities';
import { SyncServiceApi } from '../../services/sync-service-api';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  frmLogin: FormGroup;
  frmData: {userName: string, password: string};
  loginData: string;
  roles : string[];
  loader : any;

  constructor(
    private syncServiceApi: SyncServiceApi,
    private loginApi: LoginServiceApi,
    private menu: MenuController,
    private loading: LoadingController,
    private navCtrl: NavController,
    private builder: FormBuilder,
    private alertCtrl: AlertController) {

        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        this.frmLogin = builder.group({
           'userName': ['',Validators.required],
           'password': ['',Validators.required]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    onSubmit(formData) {
      
            this.loader = this.loading.create({
                content: 'Signing in...',
            });

            this.loader.present().then(() => {
            this.frmData = formData;

            this.loginData = 'username=' + this.frmData.userName + '&password=' + this.frmData.password + '&grant_type=password';

            this.loginApi.postLogin(this.loginData).subscribe(res => {
                
                localStorage.setItem('token', res.access_token);
                localStorage.setItem('userid',res.userid);
                this.navCtrl.setRoot(ActivitiesPage);
                this.loader.dismiss();

            }, err => {
                console.log(JSON.stringify(err));
                this.loader.dismiss();
                return;
            });
        });
   }

}
