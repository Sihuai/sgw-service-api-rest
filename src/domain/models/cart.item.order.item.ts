import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('CartItemOrderItem')
export class CartItemOrderItem extends BaseModel {
    constructor() {
        super();
    }
}