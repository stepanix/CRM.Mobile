import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule} from '@angular/http';
import { CalendarModule } from "ion2-calendar";
import { DatePicker } from 'ionic2-date-picker';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReactiveFormsModule }  from '@angular/forms';
import { ActivitiesPage } from '../pages/activities/activities';
import { SchedulePage } from '../pages/schedule/schedule';
import { AddSchedulePage } from '../pages/addschedule/addschedule';
import { VisitPage } from '../pages/visit/visit';
import { ListFormsPage } from '../pages/listforms/listforms';

import { FormPage } from '../pages/form/form';
import { NetworkPage } from '../pages/network/network';
import { VisitStatusPage } from '../pages/visitstatus/visitstatus';
import { PlacesPage } from '../pages/places/places';


import { AutoCompleteModule } from 'ionic2-auto-complete';


@NgModule({
  declarations: [
      MyApp,
      HomePage,
      ListPage,
      ActivitiesPage,
      LoginPage,
      SchedulePage,
      AddSchedulePage,
      DatePicker,
      VisitPage,
      ListFormsPage,
      FormPage,
      NetworkPage,
      VisitStatusPage,
      PlacesPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    CalendarModule,
    AutoCompleteModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
      MyApp,
      HomePage,
      ListPage,
      ActivitiesPage,
      LoginPage,
      SchedulePage,
      AddSchedulePage,
      DatePicker,
      VisitPage,
      ListFormsPage,
      FormPage,
      NetworkPage,
      VisitStatusPage,
      PlacesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
