import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('Media')
export class Media extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.orientation = '';
        this.format = '';
        this.uri = '';
    }

    @Attribute()
    type: string;
    @Attribute()
    orientation: string;
    @Attribute()
    format: string;
    @Attribute()
    uri: string;
}

// export interface IMediaMainFields {
//     body: string;
//     subject?: string;
// }
  
// export interface IMediaDTO extends IMediaMainFields {
//     attachmentIds: number[];
//     references: number[];
//     threadId: number;
// }