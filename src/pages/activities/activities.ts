import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import { ScheduleRepoApi } from '../../repos/schedule-repo-api';
import { VisitPage } from '../visit/visit';
import * as moment from 'moment';


@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
})
export class ActivitiesPage {

    loader: any;
    activities: any[] = [];

    constructor(private scheduleRepoApi: ScheduleRepoApi,
        private activityRepoApi: ActivityRepoApi,
        private syncServiceApi: SyncServiceApi,
        private loading: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {

        var token = localStorage.getItem('token');

        if (token === null || token === undefined || token === "null") {
            this.navCtrl.setRoot(LoginPage);
        } else {
            this.getCheckedInVisit();
            this.getActivityLog();
            this.loader = this.loading.create({
                content: 'Synching data, please wait...',
            });

            this.loader.present().then(() => {
                syncServiceApi.downloadServerData();
                this.loader.dismiss();
            });
        }
    }

    getCheckedInVisit() {
        this.scheduleRepoApi.getChekedInVisit().then((res) => {
            if (res.results.length > 0) {
                this.navCtrl.push(VisitPage, {
                    scheduleId: res.results[0].Id,
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

}
