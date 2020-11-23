import { Document, Collection, Entities, Index, Attribute, Related, OneToOne, OneToMany } from 'type-arango'
import { BaseModel } from './base.model';
import { Card } from './card';

@Document()
export class Section extends BaseModel {
    @Index()
    @Attribute()
    sequence?: number;
    @Attribute()
    header?: string;
    @Attribute()
    uri?: string;
    @Attribute()
    color?: string;
    @Attribute()
    @OneToMany(type => Card, Card => Card.owner)
    cards?: Related<Card[]>;
    // @OneToOne(type => Pagination, Pagination => Pagination.owner)
    // pagination?: Related<Pagination>;
}

export interface ISectionMainFields {
    body: string;
    subject?: string;
}
  
export interface ISectionDTO extends ISectionMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}


@Collection(of => Section)
export class Sections extends Entities {
    static select(filters) {
        const result = Sections.findOne({filter:filters});
        if(!result) return null;
		return result;
    }
}