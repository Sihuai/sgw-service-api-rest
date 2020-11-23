import { Document, Collection, Entities, Index, Attribute, Related, OneToOne } from 'type-arango'
import { BaseModel } from './base.model';
import { Media } from './media';

@Document()
export class Card extends BaseModel {
    @Index()
    @Attribute()
    sequence?: number;
    @Attribute()
    title?: string;
    @Attribute()
    @OneToOne(type => Media, Media => Media.owner)
    media?: Related<Media>;
}

export interface ICardMainFields {
    body: string;
    subject?: string;
}
  
export interface ICardDTO extends ICardMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}


@Collection(of => Card)
export class Cards extends Entities {
    static select(filters) {
        const result = Cards.findOne({filter:filters});
        if(!result) return null;
		return result;
    }
}