import moment from "moment";
import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Address } from "./address";
import { BaseModel } from './base.model';
import { Price } from "./price";

@Entity('Order')
export class Order extends BaseModel {
    constructor() {
        super();
        this.sn = moment().utc().format('YYMMDD-HHmmss-SSS');;
        this.tag = '';
        this.quantity = -1;
        this.status = '';
        this.amount = new Price();
        // this.delivery = new Address();
    }

    @HashIndex({ unique: true, name: 'ix_order_sn' })
    @Attribute()
    sn: string;
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