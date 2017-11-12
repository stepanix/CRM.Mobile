import { Injectable } from '@angular/core';
import { QueryBuilder } from '../services/query-builder';
import { ScheduleModel } from '../models/ScheduleModel';

import * as moment from 'moment';

@Injectable()
export class ScheduleRepoApi {

    private header: Headers;

    constructor() {
    }

    delete() {
        var data = new QueryBuilder(new ScheduleModel());
        data.delete();
    }

    deleteSynched(dataDto: any[]) {
        var data = new QueryBuilder(new ScheduleModel());
        for (var i = 0; i < dataDto.length; i++) {
            data.where("Id", "=", dataDto[i].syncId).delete();
        }
    }

    insert(dataDto: any[]) {
        var data = new QueryBuilder(new ScheduleModel());
        for (var i = 0; i < dataDto.length; i++) {
            data.create(dataDto[i]);
        }
    }

    checkOutVisit(dtoScheduleIn: any) {
        var data = new QueryBuilder(new ScheduleModel());
        dtoScheduleIn.VisitStatus = "Visited";
        dtoScheduleIn.IsVisited = "true";
        dtoScheduleIn.CheckOutTime = moment().format("YYYY-MM-DD HH:mm");
        dtoScheduleIn.IsSynched = 0;
        console.log("checkoutdata", JSON.stringify(dtoScheduleIn));
        data.where("RepoId", "=", dtoScheduleIn.RepoId).update(dtoScheduleIn);
    }

    checkInVisit(dataDto: any) {
        var data = new QueryBuilder(new ScheduleModel());
        dataDto.VisitStatus = "In";
        dataDto.CheckInTime = moment().format("YYYY-MM-DD HH:mm");
        dataDto.IsSynched = 0;
        data.where("RepoId", "=", dataDto.RepoId).orWhere("ServerId","=",dataDto.ServerId).update(dataDto);
    }

    getChekedInVisit() {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("VisitStatus", "=", "In").get();
        return results;
    }

    insertRecord(dataDto: any) {
        var data = new QueryBuilder(new ScheduleModel());
        data.create(dataDto);
    }

    list(): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.get("*");
        return results;
    }

    listByDate(placeId: string, visitDate: string): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());        
        var results = null;
        if (placeId === undefined) {
            results = data.where("VisitDate", "=", visitDate).get();
        } else {
            results = data.where("PlaceId", "=", placeId).get();
        }
        return results;
    }

    listScheduleDates(placeId: string): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = null;
        if (placeId === undefined) {
            results = data.rawQuery("SELECT DISTINCT VisitDate FROM schedule ", null);
        }else{
            results = data.rawQuery("SELECT DISTINCT VisitDate FROM schedule WHERE PlaceId =?", [placeId]);
        }
        return results;
    }

    listScheduledPlaces(): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results =data.rawQuery("SELECT DISTINCT PlaceId, PlaceName, PlaceAddress FROM schedule", []);
        return results;
    }

    updateMissedSchedule() {
        var currentDate =  moment().format("YYYY-MM-DD");
        var data = new QueryBuilder(new ScheduleModel());
        data.rawQuery("UPDATE schedule SET VisitStatus = 'Missed', IsMissed='true', IsSynched = 0 WHERE (VisitStatus = ? OR VisitStatus = ?) AND VisitDate < ? ", ["Scheduled","New visit",currentDate]);
    }

    listById(Id: string): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("RepoId", "=", Id).get();
        return results;
    }

    listByScheduleId(Id: string): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("RepoId", "=", Id).get();
        return results;
    }

    listUnSynched(): Promise<any> {
        var data = new QueryBuilder(new ScheduleModel());
        var results = data.where("IsSynched", "=", "0").get();
        return results;
    }

    updateRecord(dataDto: any) {
        var data = new QueryBuilder(new ScheduleModel());
        data.where("ServerId", "=", dataDto.Id).orWhere("Id", "=", dataDto.Id).update(dataDto);
    }



}