import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('OrderItemUserAnimation')
export class OrderItemUserAnimation extends BaseModel {
    constructor() {
        super();
    }
}