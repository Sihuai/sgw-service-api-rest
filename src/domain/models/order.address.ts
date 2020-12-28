import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('OrderAddress')
export class OrderAddress extends BaseModel {
    constructor() {
        super();
    }
}