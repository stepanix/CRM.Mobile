import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,MenuController,LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceApi,ProductServiceApi } from '../../shared/shared';
import { ProductRepoApi } from '../../repos/product-repo-api';
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

  constructor(
    private productRepoApi: ProductRepoApi,
    private productServiceApi : ProductServiceApi,
    private loginApi: LoginServiceApi,
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

    downloadProductsApi(){
        var products:any[] = [];
        this.productServiceApi.getProducts()
        .subscribe(
            res => {
                for(var i = 0;i < res.length; i++){
                    products.push({
                        Id : i+1,
                        ServerId:res[i].id,
                        Name: res[i].name
                    });
                }
                this.productRepoApi.deleteProducts();
                this.productRepoApi.insertProducts(products);
                // this.productRepoApi.listProducts().then((data) => {
                //     for(var i = 0; i<data.results.length;i++){
                //         console.log(data.results[i].Name);
                //     }
                // });
            },err => {
              console.log(err);
              return;
          });
    }

    onSubmit(formData) {
      
             this.loader = this.loading.create({
                content: 'signing in...',
              });
      
              this.loader.present().then(() => {
              this.frmData = formData;
      
              this.loginData = 'username=' + this.frmData.userName + '&password=' + this.frmData.password + '&grant_type=password';
      
              this.loginApi.postLogin(this.loginData).subscribe(res => {
                  localStorage.setItem('token', res.access_token);
                  this.downloadProductsApi();
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
                   console.log(JSON.stringify(err));
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
