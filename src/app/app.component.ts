import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ActivitiesPage } from '../pages/activities/activities';
import { SchedulePage } from '../pages/schedule/schedule';
import { LoginPage } from '../pages/login/login';
import { LoginServiceApi,ScheduleServiceApi,UserServiceApi } from '../shared/shared';
import { PlaceServiceApi,ProductServiceApi } from '../shared/shared';
import {RepsAutoCompleteService} from '../services/reps-autocomplete-service-api';
import {PlacesAutoCompleteService} from '../services/place-autocomplete-service-api';
import {ProductRepoApi} from '../repos/product-repo-api';


@Component({
  templateUrl: 'app.html',
  providers:[
    LoginServiceApi,
    ScheduleServiceApi,
    UserServiceApi,
    PlaceServiceApi,
    ProductServiceApi,
    RepsAutoCompleteService,
    PlacesAutoCompleteService,
    ProductRepoApi
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ActivitiesPage;
  
  private loginPage;
  private activitiesPage;
  private schedulePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {

      this.initializeApp();
      this.loginPage = LoginPage;
      this.activitiesPage = ActivitiesPage;
      this.schedulePage = SchedulePage;

      // used for an example of ngFor and navigation
      this.pages = [
      ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
  }

  navigatePage(p){
    this.nav.setRoot(p)
  } 

}
