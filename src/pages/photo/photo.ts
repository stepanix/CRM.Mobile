import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {PhotoRepoApi} from '../../repos/photo-repo-api';
import {ActivityRepoApi} from '../../repos/activity-repo-api';
import * as moment from 'moment';

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {

  photoModel : any = {};
  base64Image: string = "assets/camera.png";
  scheduleId : any;
  placeId : any;
  photoRepoId : any;
  photoId : any;
  placeName : string;

  constructor(public activityRepoApi : ActivityRepoApi,
              public toastCtrl: ToastController,
              public photoRepoApi : PhotoRepoApi,
              public actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              public navCtrl: NavController, 
              public navParams: NavParams) {
        
         this.placeName = this.navParams.get('placeName');
         this.photoId = this.navParams.get('Id');
         this.placeId = this.navParams.get('placeId');
         this.scheduleId = this.navParams.get('scheduleId');
         this.photoModel.Note = "";
  }

  ionViewDidLoad() {
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change your profile picture',
      buttons: [
            {
              text: 'Take a picture',
              handler: () => {
              this.takePhoto();
            }
            },{
              text: 'Select from gallery',
              handler: () => {
              this.selectPhoto();
            }
            },{
              text: 'Cancel',
            }
      ]
    });
    actionSheet.present();
  }

  savePhotoRepo() {
      this.photoId = this.newGuid();
      let PhotoDtoIn = {
          Id : this.photoId,
          ServerId: 0,
          PictureUrl : this.base64Image,
          Note : this.photoModel.Note,
          ScheduleId : this.scheduleId,
          PlaceId : this.placeId,
          IsSynched : 0
      }
      this.logActivityRepo();
      this.photoRepoApi.insertRecord(PhotoDtoIn);
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
       ActivityLog: 'Photos',
       IsSynched: 0,
       DateCreated : moment().format('YYYY-MM-DD').toString()
    }
    this.activityRepoApi.insertRecord(ActivityDtoIn);
 }

  updatePhotoRepo(){
        let PhotoDtoIn = {
          Id : this.photoId,
          ServerId: 0,
          PictureUrl : this.base64Image,
          Note : this.photoModel.Note,
          ScheduleId : this.scheduleId,
          PlaceId : this.placeId,
          IsSynched : 0
      }
      this.photoRepoApi.updateRecord(PhotoDtoIn);
      let toast = this.toastCtrl.create({
          message: 'Record updated successfully',
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


  takePhoto() {
    var options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum : true
    }
    this.camera.getPicture(options).then((imageData) => {          
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}

  selectPhoto() {
        let returnImage = this;

        var libOptions = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
      
        this.camera.getPicture(libOptions).then((filePath) => {
              window["plugins"].Base64.encodeFile(filePath, function(base64) {
                   console.log(base64);
                   returnImage.base64Image = base64;
              });
              
        }, (err) => {
        });
   }

}
