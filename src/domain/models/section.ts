import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Card } from './card';

@Entity()
export class Section extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.header = '';
        this.uri = '';
        this.color = '';
        this.cards = [];
    }

    @HashIndex({ unique: true, name: "ix_section_sequence" })
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
    // // pagination?: Related<Pagination>;
    cards: Card[];
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