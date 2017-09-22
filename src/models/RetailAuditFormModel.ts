import {BaseModel} from '../services/query-builder';

export class RetailAuditFormModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'retailAuditForm';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        Name: 'TEXT',
        Description: 'TEXT',
        Available : 'TEXT',
        Promoted : 'TEXT',
        Price : 'TEXT',
        StockLevel : 'TEXT',
        Note : 'TEXT',
        Fields: 'TEXT'
    }

}