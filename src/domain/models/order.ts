import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Address } from "./address";
import { BaseModel } from './base.model';
import { Price } from "./price";

@Entity('Order')
export class Order extends BaseModel {
    constructor() {
        super();
        this.tag = '';
        this.quantity = -1;
        this.status = '';
        this.amount = new Price();
        // this.delivery = new Address();
    }

    @Attribute()
    tag: string;
    @Attribute()
    quantity: number;
    @Attribute()
    status: string;
    @Attribute()
    amount: Price;
    @Attribute()
    delivery?: Address;
}