import { Document, Collection, Entities, Attribute } from 'type-arango'
import { BaseModel } from './base.model';

@Document()
export class Media extends BaseModel {
    @Attribute()
    type?: number;
    @Attribute()
    orientation?: number;
    @Attribute()
    format?: number;
    @Attribute()
    uri?: string;
}

export interface IMediaMainFields {
    body: string;
    subject?: string;
}
  
export interface IMediaDTO extends IMediaMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}


@Collection(of => Media)
export class Medias extends Entities {
    static select(filters) {
        const result = Medias.findOne({filter:filters});
        if(!result) return null;
		return result;
    }
}