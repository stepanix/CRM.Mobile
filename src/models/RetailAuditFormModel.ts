import {BaseModel} from '../services/query-builder';

export class RetailAuditFormModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'retailAuditForm';
    public schema: Object = {
        Id: 'INTEGER(11) PRIMARY KEY',
        ServerId : 'INTEGER(11)',
        Name: 'TEXT',
        Description: 'TEXT',
        Available : 'INTEGER(1)',
        Promoted : 'INTEGER(1)',
        Price : 'INTEGER(1)',
        StockLevel : 'INTEGER(1)',
        Note : 'INTEGER(1)',
        Fields: 'TEXT'
    }

}