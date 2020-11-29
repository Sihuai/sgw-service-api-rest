import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('Media')
export class Media extends BaseModel {
    constructor() {
        super();
        this.type = -1;
        this.orientation = -1;
        this.format = -1;
        this.uri = "";
    }

    @Attribute()
    type: number;
    @Attribute()
    orientation: number;
    @Attribute()
    format: number;
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