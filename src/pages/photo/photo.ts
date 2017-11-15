import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,AlertController,LoadingController,ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {PhotoRepoApi} from '../../repos/photo-repo-api';
import {ActivityRepoApi} from '../../repos/activity-repo-api';
import * as moment from 'moment';

import { SyncServiceApi } from '../../services/sync-service-api';
import { ActivitiesPage } from '../activities/activities';

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
  loader: any;
  isDisabled : boolean = false;

  constructor(private syncServiceApi: SyncServiceApi,
              private alertCtrl: AlertController,
              private loading: LoadingController,
              public activityRepoApi : ActivityRepoApi,
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

         if(this.photoId !== undefined) {
            this.getPhotoRepo();
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
                    this.photoRepoApi.submit(this.photoId);
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

  ionViewDidLoad() {
  }

  getPhotoRepo() {
    this.photoRepoApi
    .listById(this.photoId)
    .then((res) => {
          this.photoId = res.results[0].Id;
          this.photoModel.Note = res.results[0].Note;
          this.base64Image = res.results[0].PictureUrl;
          if(res.results[0].Submitted === 1 || res.results[0].Submitted===2){
            this.isDisabled = true;
          }
     });
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
          IsSynched : 0,
          RepoId : this.photoId
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
       FullName : localStorage.getItem('fullname'),
       PlaceName : this.placeName,
       PlaceId: this.placeId,
       ActivityLog: 'Photos',
       ActivityTypeId : this.photoId,
       IsSynched: 0,
       DateCreated : moment().format().toString()
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
