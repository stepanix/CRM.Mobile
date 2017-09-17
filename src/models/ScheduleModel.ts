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
        IsRecurring: 'INTEGER(1)',
        RepeatCycle : 'INTEGER(5)',
        IsScheduled: 'INTEGER(1)',
        IsVisited: 'INTEGER(1)',
        IsMissed: 'INTEGER(1)',
        IsUnScheduled: 'INTEGER(1)',
        VisitStatus: 'TEXT',
        CheckInTime: 'TEXT',
        CheckOutTime: 'TEXT',
        IsSynched: 'INTEGER(1)'
    }

}