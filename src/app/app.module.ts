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
import { AddPlacePage } from '../pages/addplace/addplace';
import { PhotoPage } from '../pages/photo/photo';
import { NotePage } from '../pages/note/note';
import { ListRetailAuditFormPage } from '../pages/listretailauditform/listretailauditform';
import { RetailAuditFormPage } from '../pages/retailauditform/retailauditform';
import { ListProductPage } from '../pages/listproduct/listproduct';
import { OrdersPage } from '../pages/orders/orders';
import { SummaryPage } from '../pages/summary/summary';
import { OrderItemPage } from '../pages/orderitem/orderitem';
import { TimeMileagePage } from '../pages/timemileage/timemileage';



import { AutoCompleteModule } from 'ionic2-auto-complete';

import { AgmCoreModule } from "angular2-google-maps/core";
import { Camera } from '@ionic-native/camera';
import { SignaturePadModule } from 'angular2-signaturepad';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
// import { LaunchNavigator} from '@ionic-native/launch-navigator';



@NgModule({
  declarations: [
      MyApp,
      SummaryPage,
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
      PlacesPage,
      AddPlacePage,
      PhotoPage,
      NotePage,
      ListRetailAuditFormPage,
      RetailAuditFormPage,
      ListProductPage,
      OrdersPage,
      OrderItemPage,
      TimeMileagePage
  ],
  imports: [
    AgmCoreModule.forRoot({
        apiKey: "AIzaSyC6UFj0VOyEzkqseKrklaDH8XOTJh_q6wk",
        libraries: ["places"]
    }),
    SignaturePadModule ,
    HttpModule,
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    CalendarModule,
    AutoCompleteModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
      MyApp,
      SummaryPage,
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
      PlacesPage,
      AddPlacePage,
      PhotoPage,
      NotePage,
      ListRetailAuditFormPage,
      RetailAuditFormPage,
      ListProductPage,
      OrdersPage,
      OrderItemPage,
      TimeMileagePage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    BarcodeScanner,
    Geolocation,    
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
