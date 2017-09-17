import {BaseModel} from '../services/query-builder';


export class FormModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'form';
    public schema: Object = {
        Id: 'INTEGER(11) PRIMARY KEY',
        ServerId : 'INTEGER(11)',
        Title: 'TEXT',
        Description: 'TEXT',
        Fields: 'TEXT'
    }
}