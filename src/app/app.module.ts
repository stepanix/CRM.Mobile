import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule} from '@angular/http';
import { CalendarModule } from "ion2-calendar";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReactiveFormsModule }  from '@angular/forms';
import { ActivitiesPage } from '../pages/activities/activities';
import { SchedulePage } from '../pages/schedule/schedule';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ActivitiesPage,
    LoginPage,
    SchedulePage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    CalendarModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ActivitiesPage,
    LoginPage,
    SchedulePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
