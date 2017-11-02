import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ActivitiesPage } from '../pages/activities/activities';
import { SchedulePage } from '../pages/schedule/schedule';
import { PlacesPage } from '../pages/places/places';
import { LoginPage } from '../pages/login/login';
import { SummaryPage } from '../pages/summary/summary';
import { VisitPage } from '../pages/visit/visit';
import { SyncServiceApi } from '../services/sync-service-api';
import { LoginServiceApi, ScheduleServiceApi, UserServiceApi, NoteServiceApi, OrderServiceApi,OrderItemServiceApi } from '../shared/shared';
import { PlaceServiceApi, ProductServiceApi, FormServiceApi, PhotoServiceApi, ActivityServiceApi,TimeMileageServiceApi } from '../shared/shared';
import { RetailAuditFormServiceApi, StatusServiceApi, FormValueServiceApi, ProductRetailAuditServiceApi } from '../shared/shared';

import { RepsAutoCompleteService } from '../services/reps-autocomplete-service-api';
import { PlacesAutoCompleteService } from '../services/place-autocomplete-service-api';
import { ProductRepoApi } from '../repos/product-repo-api';
import { FormRepoApi } from '../repos/form-repo-api';
import { PlaceRepoApi } from '../repos/place-repo-api';
import { RetailAuditFormRepoApi } from '../repos/retailauditform-repo-api';
import { ScheduleRepoApi } from '../repos/schedule-repo-api';
import { StatusRepoApi } from '../repos/status-repo-api';
import { UserRepoApi } from '../repos/user-repo-api';
import { FormValueRepoApi } from '../repos/formvalue-repo-api';
import { PhotoRepoApi } from '../repos/photo-repo-api';
import { NoteRepoApi } from '../repos/note-repo-api';
import { ProductRetailRepoApi } from '../repos/productretailaudit-repo-api';
import { ActivityRepoApi } from '../repos/activity-repo-api';
import { OrderRepoApi } from '../repos/order-repo-api';
import { OrderItemRepoApi } from '../repos/orderitem-repo-api';
import { TimeMileageRepoApi } from '../repos/timemileage-repo-api';

import { Geolocation } from '@ionic-native/geolocation';

@Component({
    templateUrl: 'app.html',
    providers: [
        Network,
        TimeMileageServiceApi,
        OrderItemServiceApi,
        OrderServiceApi,
        ActivityServiceApi,
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
        StatusRepoApi,
        UserRepoApi,
        FormValueServiceApi,
        FormValueRepoApi,
        PhotoRepoApi,
        PhotoServiceApi,
        NoteServiceApi,
        NoteRepoApi,
        ProductRetailAuditServiceApi,
        ProductRetailRepoApi,
        ActivityRepoApi,
        OrderRepoApi,
        OrderItemRepoApi,
        TimeMileageRepoApi
    ]
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    loader: any;

    rootPage: any = ActivitiesPage;

    private loginPage;
    private activitiesPage;
    private schedulePage;
    private placesPage;
    private summaryPage;
    private visitPage;

    pages: Array<{ title: string, component: any }>;

    constructor(private geolocation: Geolocation,
        private scheduleRepoApi: ScheduleRepoApi,
        private network: Network,
        private loading: LoadingController,
        private syncServiceApi: SyncServiceApi,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen) {

        this.initializeApp();
        this.loginPage = LoginPage;
        this.activitiesPage = ActivitiesPage;
        this.schedulePage = SchedulePage;
        this.placesPage = PlacesPage;
        this.summaryPage = SummaryPage;
        this.visitPage = VisitPage;
        
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
                localStorage.setItem("isOnline", "false");
                console.log("isOnline = false");
            });

            let connectSubscription = this.network.onConnect().subscribe(() => {
                localStorage.setItem("isOnline", "true");
                console.log("isOnline = true");
            });

            let watch = this.geolocation.watchPosition();
            watch.subscribe((data) => {
                localStorage.setItem("lat", data.coords.latitude.toString());
                localStorage.setItem("lng", data.coords.longitude.toString());
            });
        });
    }

    distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }

    ngOnInit() {
        this.getCheckedInVisit();
    }

    getCheckedInVisit() {
        this.scheduleRepoApi.getChekedInVisit().then((res) => {
            if (res.results.length > 0) {
                this.nav.setRoot(this.visitPage, {
                    scheduleId: res.results[0].RepoId,
                    repoId: res.results[0].RepoId,
                    placeId: res.results[0].PlaceId,
                    placeName: res.results[0].PlaceName,
                    streetAddress: res.results[0].PlaceAddress,
                    lat: res.results[0].Latitude,
                    lng: res.results[0].Longitude
                });
            }
        });
    }

    openPage(page) {
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
