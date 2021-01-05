import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('ProductProductCategory')
export class ProductProductCategory extends BaseModel {
    constructor() {
        super();
    }
}