import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PlacesPage } from '../places/places';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import * as moment from 'moment';


@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
})
export class ActivitiesPage {

    loader: any;
    activities: any[] = [];

    constructor(private activityRepoApi: ActivityRepoApi,
        private syncServiceApi: SyncServiceApi,
        private loading: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    ngAfterContentInit() {
        var token = localStorage.getItem('token');

        if (token === null || token === undefined || token === "null") {
            this.navCtrl.setRoot(LoginPage);
        } else {
            this.getActivityLog();
            this.loader = this.loading.create({
                content: 'Synching data, please wait...',
            });

            this.loader.present().then(() => {
                this.syncServiceApi.downloadServerData();
                this.loader.dismiss();
            });
        }
    }

    

    getActivityLog() {
        this.activities = [];
        this.activityRepoApi.list().then((res) => {
            for (var i = 0; i < res.results.length; i++) {
                this.activities.push({
                    PlaceName: res.results[i].PlaceName,
                    ActivityLog: res.results[i].ActivityLog,
                    DateCreated: moment(res.results[i].DateCreated).format("lll")
                });
            }
        });
    }

    ionViewDidLoad() {

    }

    navigateToPlaces(){
        this.navCtrl.push(PlacesPage);
    }

}
