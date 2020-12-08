import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Media } from './media';

export class Data {
    constructor() {
        this.price = 0.0;
        this.currency = '';
        this.content = '';
    }

    @Attribute()
    price: number;
    @Attribute()
    currency: string;
    @Attribute()
    content: string;
}

@Entity('Category')
export class Category extends Media {
    constructor() {
        super();
        this.sequence = -1;
        // this.titles = '';
        // this.captions = '';
    }

    @HashIndex({ unique: true, name: 'ix_category_sequence' })
    @Attribute()
    sequence: number;
    @Attribute()
    titles?: string;
    @Attribute()
    captions?: string;
    @Attribute()
    tag?: string;
    @Attribute()
    data?: Data;
}