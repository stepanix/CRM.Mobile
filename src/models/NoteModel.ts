import {BaseModel} from '../services/query-builder';


export class NoteModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'note';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        PlaceId : 'INTEGER(11)',
        Description : 'TEXT',
        IsSynched: 'INTEGER(1)'
    }

}