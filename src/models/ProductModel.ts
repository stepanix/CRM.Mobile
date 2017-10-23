import {BaseModel} from '../services/query-builder';


export class ProductModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'product';
    public schema: Object = {
        Id: 'TEXT',
        ServerId : 'INTEGER(11)',
        Name : 'TEXT',
        Price : 'TEXT'
    }

}