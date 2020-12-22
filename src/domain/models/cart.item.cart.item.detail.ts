import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('CartItemCartItemDetail')
export class CartItemCartItemDetail extends BaseModel {
    constructor() {
        super();
    }
}