import {BaseModel} from '../services/query-builder';

export class ActivityModel extends BaseModel {
    public database: string = 'crm.db';
    public table: string = 'activity';
    public schema: Object = {
        Id: 'TEXT',
        PlaceName : 'TEXT',
        PlaceId: 'TEXT',
        ActivityLog: 'TEXT',
        IsSynched: 'INTEGER(1)',
        PlaceRepoId : 'TEXT',
        DateCreated : 'TEXT'
    }
}