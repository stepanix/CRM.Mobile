import { BaseModel } from '../services/query-builder';


export class OrderItemModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'orderitems';
    public schema: Object = {
        Id: 'TEXT',
        ServerId: 'INTEGER(11)',
        OrderId: 'TEXT',
        ProductId: 'INTEGER(11)',
        Quantity: 'INTEGER(11)',
        Amount: 'TEXT',
        IsSynched: 'INTEGER(1)',
        Submitted : 'INTEGER(1)',
        RepoId : 'TEXT'
    }

}