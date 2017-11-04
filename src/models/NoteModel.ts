import {BaseModel} from '../services/query-builder';


export class NoteModel extends BaseModel {
        public database: string = 'crm.db';
        public table: string = 'note';
        public schema: Object = {
            Id: 'TEXT',
            ServerId : 'INTEGER(11)',
            PlaceId : 'TEXT',
            ScheduleId : 'TEXT',
            Description : 'TEXT',
            IsSynched: 'INTEGER(1)',
            ScheduleRepoId: 'TEXT',
            PlaceRepoId : 'TEXT',
            Submitted : 'INTEGER(1)'
        }
}