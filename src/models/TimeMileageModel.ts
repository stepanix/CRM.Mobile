import {BaseModel} from '../services/query-builder';


export class TimeMileageModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'timemileage';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        UserId: 'TEXT',
        PlaceId: 'TEXT',
        PlaceName: 'TEXT',
        StartTime : 'TEXT',
        EndTime: 'TEXT',
        Duration: 'TEXT',
        Mileage: 'TEXT',
        IsSynched: 'INTEGER(1)',
        DateCreated : 'TEXT'
    }

}