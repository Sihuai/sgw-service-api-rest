import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('ProductCategory')
export class ProductCategory extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.name = '';
        this.description = '';
    }

    @Attribute()
    sequence: number;
    @HashIndex({ unique: true, name: 'ix_product_category_name' })
    @Attribute()
    name: string;
    @Attribute()
    description: string;
}