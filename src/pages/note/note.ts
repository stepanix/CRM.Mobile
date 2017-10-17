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

      if(this.noteId !== undefined) {
        this.getNoteRepo();
      }
  }

  getNoteRepo() {
      this.noteRepoApi
      .listByNoteId(this.noteId)
      .then((res) => {
            this.noteId = res.results[0].Id;
            this.noteModel.Description = res.results[0].Description;
       });
   }

  saveNoteRepo() {
    if (this.noteId===undefined) {
        this.insertNoteRepo();
    }else{
        this.updateNoteRepo();
    }
    this.navCtrl.pop();
  }

insertNoteRepo() {
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

updateNoteRepo() {
    let NoteDtoIn = {
        Id : this.noteId,
        ServerId: 0,
        Description : this.noteModel.Description,
        ScheduleId : this.scheduleId,
        PlaceId : this.placeId,
        IsSynched : 0
    }
    this.noteRepoApi.updateRecord(NoteDtoIn);
}

logActivityRepo() {
   let ActivityDtoIn = {
      Id: this.newGuid(),     
      PlaceName : this.placeName,
      PlaceId: this.placeId,
      ActivityLog: 'Notes',
      ActivityTypeId : this.noteId,
      IsSynched: 0,      
      DateCreated : moment().format().toString()
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
