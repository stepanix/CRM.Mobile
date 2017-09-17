import {BaseModel} from '../services/query-builder';


export class ScheduleModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'schedule';
    public schema: Object = {
        Id: 'INTEGER(11) PRIMARY KEY',
        ServerId : 'INTEGER(11)',
        PlaceId: 'INTEGER(11)',
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
        IsSynched: 'INTEGER(1)'
    }

}