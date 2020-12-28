import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('OrderOrderItem')
export class OrderOrderItem extends BaseModel {
    constructor() {
        super();
    }
}