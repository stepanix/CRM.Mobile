import {BaseModel} from '../services/query-builder';


export class PhotoModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'photo';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        PlaceId : 'TEXT',
        ScheduleId : 'TEXT',
        PictureUrl : 'TEXT',
        Note : 'TEXT',
        IsSynched: 'INTEGER(1)',
        ScheduleRepoId: 'TEXT',
        PlaceRepoId : 'TEXT'
    }

}