import {BaseModel} from '../services/query-builder';

export class PlaceModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'place';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        StatusId: 'INTEGER(11)',
        Name: 'TEXT',
        StreetAddress: 'TEXT',
        Email: 'TEXT',
        WebSite: 'TEXT',
        ContactName: 'TEXT',
        ContactTitle: 'TEXT',
        Phone: 'TEXT',
        CellPhone: 'TEXT',
        IsSynched: 'INTEGER(1)'
    }
}