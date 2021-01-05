import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('ShopProduct')
export class ShopProduct extends BaseModel {
    constructor() {
        super();
    }
}