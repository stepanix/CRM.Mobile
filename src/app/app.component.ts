import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ActivitiesPage } from '../pages/activities/activities';
import { SchedulePage } from '../pages/schedule/schedule';
import { LoginPage } from '../pages/login/login';
import {SyncServiceApi} from '../services/sync-service-api';
import { LoginServiceApi,ScheduleServiceApi,UserServiceApi } from '../shared/shared';
import { PlaceServiceApi,ProductServiceApi,FormServiceApi } from '../shared/shared';
import { RetailAuditFormServiceApi,StatusServiceApi } from '../shared/shared';

import {RepsAutoCompleteService} from '../services/reps-autocomplete-service-api';
import {PlacesAutoCompleteService} from '../services/place-autocomplete-service-api';
import {ProductRepoApi} from '../repos/product-repo-api';
import {FormRepoApi} from '../repos/form-repo-api';
import {PlaceRepoApi} from '../repos/place-repo-api';
import {RetailAuditFormRepoApi} from '../repos/retailauditform-repo-api';
import {ScheduleRepoApi} from '../repos/schedule-repo-api';
import {StatusRepoApi} from '../repos/status-repo-api';



@Component({
  templateUrl: 'app.html',
  providers:[
        Network,
        SyncServiceApi,
        StatusServiceApi,
        LoginServiceApi,
        ScheduleServiceApi,
        UserServiceApi,
        PlaceServiceApi,
        ProductServiceApi,
        FormServiceApi,
        RetailAuditFormServiceApi,
        RepsAutoCompleteService,
        PlacesAutoCompleteService,
        ProductRepoApi,
        FormRepoApi,
        PlaceRepoApi,
        RetailAuditFormRepoApi,
        ScheduleRepoApi,
        StatusRepoApi
    ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  loader : any;

  rootPage: any = ActivitiesPage;
  
  private loginPage;
  private activitiesPage;
  private schedulePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    private network: Network,
    private loading: LoadingController,
    private syncServiceApi : SyncServiceApi,
    public platform: Platform, 
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

          let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
              localStorage.setItem("isOnline","false");
              console.log("isOnline = false");
          });

          let connectSubscription = this.network.onConnect().subscribe(() => {
              localStorage.setItem("isOnline","true");
              console.log("isOnline = true");
          });
    });
  }

  openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
  }

  navigatePage(p) {
    this.nav.setRoot(p)
  }

  syncData() {
      this.loader = this.loading.create({
        content: 'Syncing data, please wait...',
      });

      this.loader.present().then(() => {
          //Download data from remote server
          this.syncServiceApi.downloadServerData();
          this.loader.dismiss();
      });
  }

}
