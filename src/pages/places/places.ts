import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,MenuController } from 'ionic-angular';
import { PlaceRepoApi } from '../../repos/place-repo-api';
import { ScheduleRepoApi } from '../../repos/schedule-repo-api';
import { VisitPage } from '../visit/visit';
import { AddPlacePage } from '../addplace/addplace';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class PlacesPage {

    places: any[] = [];
    placesTemp: any[] = [];
    loader: any;
    viewSelectionModel : string = "";
    currentLat : number = 0;
    currentLng : number = 0;
    currentDist : number = 0;
    dist : string = "";

    constructor(public menuCtrl: MenuController,
        private scheduleRepoApi: ScheduleRepoApi,
        private placeRepoApi: PlaceRepoApi,
        public navCtrl: NavController,
        private loading: LoadingController,
        public navParams: NavParams) {
        this.currentLat = parseFloat(localStorage.getItem("lat"));
        this.currentLng =  parseFloat(localStorage.getItem("lng"));    
        this.getScheduledPlaces();
    }

    ionViewDidLoad() {
    }

    filterPlaces(){
        if(this.viewSelectionModel==="all"){
            this.getPlaces(); 
        }else{
            this.getScheduledPlaces();
        }
        this.menuCtrl.toggle('right');
    }

    toggleMenu() {
        this.menuCtrl.enable(true, 'search');
        this.menuCtrl.toggle('right');
    }

    getScheduledPlaces() {
        this.places = [];
        this.placesTemp = [];
        this.scheduleRepoApi.listScheduledPlaces().then((res) => {
            for (var i = 0; i < res.length; i++) {
                this.currentDist = this.computeMileage(this.currentLat,this.currentLng,parseFloat(res[i].Latitude),parseFloat(res[i].Longitude),"K")
                if(this.currentDist > 10) {
                    this.dist  = "> 10 k";
                }else{
                    this.dist = this.currentDist.toFixed(2) + " k";
                }
                this.placesTemp.push({
                    id: parseInt(res[i].PlaceId),
                    name: res[i].PlaceName,
                    streetAddress: res[i].PlaceAddress,
                    placeId: this.parsePlaceId(res[i].PlaceId, res[i].PlaceId),
                    latitude: res[i].Latitude,
                    longitude: res[i].Longitude,
                    isVisited: res[i].IsVisited,
                    distance : this.dist
                });
            }
            this.places = this.placesTemp.filter(item => item.isVisited === "true");
        });
    }

    getPlaces() {
        this.loader = this.loading.create({
            content: 'Busy please wait...',
        });
        
        this.loader.present().then(() => {
            this.places = [];
            this.placeRepoApi.list().then((res) => {
                
                for (var i = 0; i < res.results.length; i++) {
                    this.currentDist = this.computeMileage(this.currentLat,this.currentLng,parseFloat(res.results[i].Latitude),parseFloat(res.results[i].Longitude),"K")
                    if(this.currentDist > 10) {
                        this.dist  = "> 10 k";
                    }else{
                        this.dist = this.currentDist.toFixed(2) + " k";
                    }
                    this.places.push({
                        id: res.results[i].ServerId,
                        name: res.results[i].Name,
                        streetAddress: res.results[i].StreetAddress,
                        placeId: this.parsePlaceId(res.results[i].ServerId, res.results[i].RepoId),
                        latitude: res.results[i].Latitude,
                        longitude: res.results[i].Longitude,
                        distance : this.dist
                    });
                }
                this.loader.dismiss();
            });
        });
    }

    parseDistance() {

    }

    computeMileage(lat1, lon1, lat2, lon2, unit) : number {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }

    parsePlaceId(serverid, repoid) {
        if (serverid === "0") {
            return repoid;
        } else {
            return serverid;
        }
    }

    openVisit(item) {
        this.isAnyPlaceCheckedIn(item);
    }

    isAnyPlaceCheckedIn(item) {
        this.scheduleRepoApi.getChekedInVisit().then((res) => {
            if (res.results.length > 0) {
                this.navCtrl.setRoot(VisitPage, {
                    scheduleId: res.results[0].RepoId,
                    repoId: res.results[0].RepoId,
                    placeId: parseInt(res.results[0].PlaceId),
                    placeName: res.results[0].PlaceName,
                    streetAddress: res.results[0].PlaceAddress,
                    lat: res.results[0].Latitude,
                    lng: res.results[0].Longitude
                });
            } else {
                this.navCtrl.push(VisitPage, {
                    scheduleId: this.newGuid(),
                    repoId: this.newGuid(),
                    placeId: item.placeId,
                    placeName: item.name,
                    streetAddress: item.streetAddress,
                    lat: item.latitude,
                    lng: item.longitude
                });
            }
        });
    }

    addPlace() {
        this.navCtrl.push(AddPlacePage);
    }

    newGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


}
