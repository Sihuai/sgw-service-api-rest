import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('OrderPaymentTransaction')
export class OrderPaymentTransaction extends BaseModel {
    constructor() {
        super();
    }
}