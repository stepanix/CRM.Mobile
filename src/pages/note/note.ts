import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {NoteRepoApi} from '../../repos/note-repo-api';

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

  constructor(public toastCtrl: ToastController,
    public noteRepoApi : NoteRepoApi,
    public navCtrl : NavController, 
    public navParams : NavParams) {

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
    let toast = this.toastCtrl.create({
        message: 'Record saved successfully',
        duration: 3000
    });
    toast.present();
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
