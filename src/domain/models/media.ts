import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity()
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


// @Collection(of => Media)
// export class Medias extends Entities {
//     static select(filters) {
//         const result = Medias.findOne({filter:filters});
//         if(!result) return null;
// 		return result;
//     }
// }