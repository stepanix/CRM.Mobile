import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormServiceApi } from '../../shared/shared';
import { FormRepoApi } from '../../repos/form-repo-api';
import { FormPage } from '../form/form';


@Component({
  selector: 'page-listforms',
  templateUrl: 'listforms.html',
})
export class ListFormsPage {

  loader: any;
  forms: any[] = [];

  scheduleId: any;
  placeId: any;
  placeName: string;

  constructor(private loading: LoadingController,
    private formServiceApi: FormServiceApi,
    private fromRepoApi: FormRepoApi,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.placeName = this.navParams.get('placeName');
    this.scheduleId = this.navParams.get('scheduleId');
    this.placeId = this.navParams.get('placeId');
  }

  ionViewDidLoad() {
    this.listFormsRepo();
  }

  listSchedule() {
    this.listFormsRepo();
  }

  listFormsRepo() {
    this.forms = [];
    this.fromRepoApi.list().then((res) => {
      for (var i = 0; i < res.results.length; i++) {
        this.forms.push({
          id: res.results[i].ServerId,
          title: res.results[i].Title,
          description: res.results[i].Description
        });
      }
    });
  }

  openForm(item) {
    this.navCtrl.push(FormPage, {
      formId: item.id,
      placeId: this.placeId,
      scheduleId: this.scheduleId,
      placeName: this.placeName
    });
  }


}
