import {BaseModel} from '../services/query-builder';


export class ProductRetailAuditModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'productRetailAudit';
    public schema: Object = {
        Id: 'INTEGER(11) PRIMARY KEY',
        ServerId : 'INTEGER(11)',
        PlaceId : 'INTEGER(11)',
        RetailAuditFormId : 'INTEGER(11)',
        ScheduleId : 'INTEGER(11)',        
        RetailAuditFormFieldValues: 'TEXT',
        IsSaved: 'INTEGER(1)',
        IsSynched: 'INTEGER(1)'
    }

}