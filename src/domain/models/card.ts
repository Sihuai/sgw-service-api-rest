import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Media } from './media';

@Entity()
export class Card extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.title = '';
        this.media = new Media();
    }

    @HashIndex({ unique: true, name: "ix_card_sequence" })
    @Attribute()
    sequence: number;
    @Attribute()
    title: string;
    @Attribute()
    // @OneToOne(type => Media, Media => Media.owner)
    // media: Related<Media>;
    media: Media;
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


// @Collection(of => Card)
// export class Cards extends Entities {
//     static select(filters) {
//         const result = Cards.findOne({filter:filters});
//         if(!result) return null;
// 		return result;
//     }
// }