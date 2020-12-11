import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Media } from './media';
import { Price } from "./price";

export class Data {
    constructor() {
        this.price = new Price();
        this.content = '';
    }

    @Attribute()
    price: Price;
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