import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Media } from "./media";
import { OptionType } from "./option.type";
import { Price } from "./price";

export class Option {
    @Attribute()
    models?: OptionType[];
    @Attribute()
    bundles?: OptionType[];
    @Attribute()
    colors?: OptionType[];
    @Attribute()
    wgt?: OptionType[];
}

@Entity('Product')
export class Product extends BaseModel {
    constructor() {
        super();
        this.sku = '';
        this.name = '';
        this.description = '';
        this.options = new Option();
        this.delivery = [];
        this.price = new Price();
        this.posters = [];
    }

    @HashIndex({ unique: true, name: 'ix_product_sku' })
    @Attribute()
    sku: string;
    @Attribute()
    name: string;
    @Attribute()
    description: string;
    @Attribute()
    options: Option;
    @Attribute()
    delivery: OptionType[];
    @Attribute()
    price: Price;
    @Attribute()
    posters: Media[];
}