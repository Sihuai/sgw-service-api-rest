import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Pagination } from "../../infra/utils/oct-orm/models/pagination";
import { BaseModel } from './base.model';
import { Card } from './card';

@Entity('Section')
export class Section extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.header = '';
        this.uri = '';
        this.color = '';
        this.cards = [];
        this.pagination = new Pagination();
    }

    @HashIndex({ unique: true, name: 'ix_section_sequence' })
    @Attribute()
    sequence: number;
    @Attribute()
    header: string;
    @Attribute()
    uri: string;
    @Attribute()
    color: string;
    @Attribute()
    // @OneToMany(type => Card, Card => Card.owner)
    // cards: Related<Card[]>;
    // // @OneToOne(type => Pagination, Pagination => Pagination.owner)
    cards: Card[];
    pagination: Pagination;
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