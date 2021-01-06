import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('ProductBrand')
export class ProductBrand extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.name = '';
        this.description = '';
    }

    @Attribute()
    sequence: number;
    @HashIndex({ unique: true, name: 'ix_product_brand_name' })
    @Attribute()
    name: string;
    @Attribute()
    description: string;
}