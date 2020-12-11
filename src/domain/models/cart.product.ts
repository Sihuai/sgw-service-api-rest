import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('CartProduct')
export class CartProduct extends BaseModel {
    constructor() {
        super();
    }
}