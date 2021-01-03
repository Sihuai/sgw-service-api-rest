import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('OrderItemUserAnimationPlayback')
export class OrderItemUserAnimationPlayback extends BaseModel {
    constructor() {
        super();
    }
}