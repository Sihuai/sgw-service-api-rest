import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('ProductProductBrand')
export class ProductProductBrand extends BaseModel {
    constructor() {
        super();
    }
}