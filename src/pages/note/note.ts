import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {NoteRepoApi} from '../../repos/note-repo-api';
import {ActivityRepoApi} from '../../repos/activity-repo-api';
import * as moment from 'moment';

@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
})
export class NotePage {

  noteModel : any = {};
  scheduleId : any;
  placeId : any;
  noteRepoId : any;
  noteId : any;
  placeName : string;

  constructor(public activityRepoApi : ActivityRepoApi,
    public toastCtrl: ToastController,
    public noteRepoApi : NoteRepoApi,
    public navCtrl : NavController, 
    public navParams : NavParams) {

      this.placeName = this.navParams.get('placeName');
      this.noteId = this.navParams.get('Id');
      this.placeId = this.navParams.get('placeId');
      this.scheduleId = this.navParams.get('scheduleId');
      this.noteModel.Description = "";
  }

  saveNoteRepo() {
    this.noteId = this.newGuid();
    let NoteDtoIn = {
        Id : this.noteId,
        ServerId: 0,
        Description : this.noteModel.Description,
        ScheduleId : this.scheduleId,
        PlaceId : this.placeId,
        IsSynched : 0
    }
    this.noteRepoApi.insertRecord(NoteDtoIn);
    this.logActivityRepo();
    let toast = this.toastCtrl.create({
        message: 'Record saved successfully',
        duration: 3000
    });
    toast.present();
}

logActivityRepo() {
   let ActivityDtoIn = {
      Id: this.newGuid(),     
      PlaceName : this.placeName,
      PlaceId: this.placeId,
      ActivityLog: 'Notes',
      IsSynched: 0,      
      DateCreated : moment().format('YYYY-MM-DD').toString()
   }
   this.activityRepoApi.insertRecord(ActivityDtoIn);
}

newGuid() : string {
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
