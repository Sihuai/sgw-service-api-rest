import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Media } from './media';

@Entity('Category')
export class Category extends Media {
    constructor() {
        super();
        this.sequence = -1;
        this.titles = '';
        this.captions = '';
    }

    @HashIndex({ unique: true, name: 'ix_category_sequence' })
    @Attribute()
    sequence: number;
    @Attribute()
    titles: string;
    @Attribute()
    captions: string;
}

export interface ICategoryMainFields {
    body: string;
    subject?: string;
}
  
export interface ICategoryDTO extends ICategoryMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}