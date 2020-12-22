import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { OptionType } from "./option.type";
import { Price } from "./price";

export class Option {
    constructor() {
    }

    @Attribute()
    model?: OptionType;
    @Attribute()
    bundle?: OptionType;
    @Attribute()
    color?: OptionType;
    @Attribute()
    wgt?: OptionType;
    @Attribute()
    persona?: OptionType;
}

@Entity('CartItem')
export class CartItem extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.name = '';
        this.description = '';
        this.uri = '';
        this.qty = 0;
        this.uom = '';
        this.tag = '';
        this.price = new Price();
    }

    @Attribute()
    type: string;
    @Attribute()
    name: string;
    @Attribute()
    description: string;
    @Attribute()
    uri: string;
    @Attribute()
    qty: number;
    @Attribute()
    uom: string;
    @Attribute()
    tag: string;
    @Attribute()
    price: Price;
    @Attribute()
    options?: Option;
}