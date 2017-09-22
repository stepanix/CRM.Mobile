import {BaseModel} from '../services/query-builder';


export class FormValueModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'formValue';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        PlaceId : 'INTEGER(11)',
        FormId : 'INTEGER(11)',
        ScheduleId : 'INTEGER(11)',        
        FormFieldValues: 'TEXT',
        IsSynched: 'INTEGER(1)'
    }

}