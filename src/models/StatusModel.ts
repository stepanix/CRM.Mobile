import {BaseModel} from '../services/query-builder';


export class StatusModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'status';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        Name : 'TEXT'
    }

}