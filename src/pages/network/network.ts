import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SyncServiceApi } from '../../services/sync-service-api';

@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
})
export class NetworkPage {
  
  isOffline : boolean = false;
  loader : any;

  constructor(private syncServiceApi: SyncServiceApi,
    private loading: LoadingController,
    private network: Network,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

    ionViewDidLoad() {
        
    }

    ngAfterViewChecked() {
          let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
              this.isOffline = true;
              console.log(this.isOffline);
          });

          let connectSubscription = this.network.onConnect().subscribe(() => {
              this.isOffline = false;
              console.log(this.isOffline);
          });
     }

    syncData() {
          this.loader = this.loading.create({
              content: 'Synching data, please wait...',
          });
          this.loader.present().then(() => {
              this.syncServiceApi.downloadServerData();
              this.loader.dismiss();
          });
    }

}
