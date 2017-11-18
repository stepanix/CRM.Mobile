import {BaseModel} from '../services/query-builder';


export class UserModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'allusers';
    public schema: Object = {
        Id: 'TEXT',
        FirstName: 'TEXT',
        Surname: 'TEXT'
    }

}