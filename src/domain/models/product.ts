import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { ProductUOMTypes } from "../enums/product.uom.types";
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
        this.uom = ProductUOMTypes.PCS;
        this.name = '';
        this.description = '';
        this.isLocked = false;
        this.options = new Option();
        this.delivery = [];
        this.price = new Price();
        this.posters = [];
    }

    @Attribute()
    sequence?: number;
    @HashIndex({ unique: true, name: 'ix_product_sku' })
    @Attribute()
    sku: string;
    @Attribute()
    uom: ProductUOMTypes;
    @Attribute()
    name: string;
    @Attribute()
    description: string;
    @Attribute()
    isLocked: boolean;
    @Attribute()
    options: Option;
    @Attribute()
    delivery: OptionType[];
    @Attribute()
    price: Price;
    @Attribute()
    posters: Media[];
}