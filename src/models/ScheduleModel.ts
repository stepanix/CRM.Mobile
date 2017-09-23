import {BaseModel} from '../services/query-builder';


export class ScheduleModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'schedule';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        PlaceId: 'INTEGER(11)',
        PlaceName: 'TEXT',
        PlaceAddress : 'TEXT',
        UserId: 'TEXT',
        VisitDate: 'TEXT',
        VisitTime: 'TEXT',
        VisitNote: 'TEXT',
        IsRecurring: 'TEXT',
        RepeatCycle : 'INTEGER(5)',
        IsScheduled: 'TEXT',
        IsVisited: 'TEXT',
        IsMissed: 'TEXT',
        IsUnScheduled: 'TEXT',
        VisitStatus: 'TEXT',
        CheckInTime: 'TEXT',
        CheckOutTime: 'TEXT',
        Latitude: 'TEXT',
        Longitude : 'TEXT',
        IsSynched: 'INTEGER(1)'
    }

}