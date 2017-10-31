import { BaseModel } from '../services/query-builder';


export class OrderModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'orders';
    public schema: Object = {
        Id: 'TEXT',
        ServerId: 'INTEGER(11)',
        PlaceId: 'TEXT',
        ScheduleId: 'TEXT',
        Quantity: 'INTEGER(11)',
        Amount: 'TEXT',
        DiscountRate: 'TEXT',
        DiscountAmount: 'TEXT',
        TaxRate: 'TEXT',
        TaxAmount: 'TEXT',
        TotalAmount: 'TEXT',
        OrderDate: 'TEXT',
        DueDays: 'TEXT',
        DueDate: 'TEXT',
        Note: 'TEXT',
        Signature: 'TEXT',
        IsSynched: 'INTEGER(1)'
    }

}