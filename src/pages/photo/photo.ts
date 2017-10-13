import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {

 
  base64Image: string = "assets/defaultUserIcon.png";

  constructor(public actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              public navCtrl: NavController, 
              public navParams: NavParams) {
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
