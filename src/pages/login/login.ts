import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,MenuController,LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceApi } from '../../shared/shared';
import { ActivitiesPage } from '../activities/activities';



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

  constructor(private loginApi: LoginServiceApi,
    private menu: MenuController,
    private loading: LoadingController,
    private navCtrl: NavController, 
    private builder: FormBuilder,
    private alertCtrl: AlertController) {
      

        localStorage.removeItem('token');
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
                content: 'signing in...',
              });
      
              this.loader.present().then(() => {
              this.frmData = formData;
              console.log(this.frmData.userName);
              console.log(this.frmData.password);
      
              this.loginData = 'username=' + this.frmData.userName + '&password=' + this.frmData.password + '&grant_type=password';
      
              this.loginApi.postLogin(this.loginData).subscribe(res => {
                  localStorage.setItem('token', res.access_token);
                  this.navCtrl.setRoot(ActivitiesPage);
                  // this.roles = res.roles.split(',');
                  // this.roles.forEach(role => {
                  //     if(role === 'Service Provider' || role === 'Manager') {
                  //         localStorage.setItem('role', role);
                  //         accessGranted = true;
                  //     }
                  // });
      
                  // if(!accessGranted)
                  // {
                  //     this.alertCtrl.create({
                  //                 title: 'Technocrat CRM Mobile',
                  //                 subTitle: "Login Failed, Please type valid login details",
                  //                 buttons: ['OK']
                  //               }).present();
                  //     this.loader.dismiss();
                  //     return;
                  // }
               }, err => {
                  // this.alertCtrl.create({
                  //                 title: 'Technocrat CRM Mobile',
                  //                 subTitle: "Login Failed, Please type valid login details ",
                  //                 buttons: ['OK']
                  //               }).present();
                  return;
               });
               this.loader.dismiss();
           });
      
          }

}
