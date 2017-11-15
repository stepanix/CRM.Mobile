import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { NoteRepoApi } from '../../repos/note-repo-api';
import { ActivityRepoApi } from '../../repos/activity-repo-api';
import * as moment from 'moment';
import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivitiesPage } from '../activities/activities';

@Component({
    selector: 'page-note',
    templateUrl: 'note.html',
})
export class NotePage {

    noteModel: any = {};
    scheduleId: any;
    placeId: any;
    noteRepoId: any;
    noteId: any;
    placeName: string;
    loader: any;
    isDisabled : boolean = false;

    constructor(private loading: LoadingController,
        private syncServiceApi: SyncServiceApi,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public activityRepoApi: ActivityRepoApi,
        public noteRepoApi: NoteRepoApi,
        public navCtrl: NavController,
        public navParams: NavParams) {

        this.placeName = this.navParams.get('placeName');
        this.noteId = this.navParams.get('Id');
        this.placeId = this.navParams.get('placeId');
        this.scheduleId = this.navParams.get('scheduleId');
        this.noteModel.Description = "";

        if (this.noteId !== undefined) {
            this.getNoteRepo();
        }
    }

    submitOrder() {
        let alertConfirm = this.alertCtrl.create({
            title: '',
            message: 'Are you sure you want to submit this record ? you will not be able to make changes after submitting',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Submit',
                    handler: () => {
                        this.noteRepoApi.submit(this.noteId);
                        this.loader = this.loading.create({
                            content: 'Submitting, please wait...',
                        });
                        this.loader.present().then(() => {
                            this.syncServiceApi.downloadServerData();
                            this.navCtrl.setRoot(ActivitiesPage);
                            this.loader.dismiss();
                        });
                    }
                }
            ]
        });
        alertConfirm.present();
    }

    getNoteRepo() {
        this.noteRepoApi
            .listByNoteId(this.noteId)
            .then((res) => {
                this.noteId = res.results[0].Id;
                this.noteModel.Description = res.results[0].Description;
                if(res.results[0].Submitted===1 || res.results[0].Submitted===2){
                    this.isDisabled = true;
                }
            });
    }

    saveNoteRepo() {
        if (this.noteId === undefined) {
            this.insertNoteRepo();
        } else {
            this.updateNoteRepo();
        }
        let toast = this.toastCtrl.create({
            message: 'Record saved successfully',
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }

    insertNoteRepo() {
        this.noteId = this.newGuid();
        let NoteDtoIn = {
            Id: this.noteId,
            ServerId: 0,
            Description: this.noteModel.Description,
            ScheduleId: this.scheduleId,
            PlaceId: this.placeId,
            IsSynched: 0,
            RepoId  : this.noteId
        }
        this.noteRepoApi.insertRecord(NoteDtoIn);
        this.logActivityRepo();
        let toast = this.toastCtrl.create({
            message: 'Record saved successfully',
            duration: 3000
        });
        toast.present();
    }

    updateNoteRepo() {
        let NoteDtoIn = {
            Id: this.noteId,
            ServerId: 0,
            Description: this.noteModel.Description,
            ScheduleId: this.scheduleId,
            PlaceId: this.placeId,
            IsSynched: 0
        }
        this.noteRepoApi.updateRecord(NoteDtoIn);
    }

    logActivityRepo() {
        let ActivityDtoIn = {
            Id: this.newGuid(),
            FullName : localStorage.getItem('fullname'),
            PlaceName: this.placeName,
            PlaceId: this.placeId,
            ActivityLog: 'Notes',
            ActivityTypeId: this.noteId,
            IsSynched: 0,
            DateCreated: moment().format().toString()
        }
        this.activityRepoApi.insertRecord(ActivityDtoIn);
    }

    newGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


    ionViewDidLoad() {
    }

}
