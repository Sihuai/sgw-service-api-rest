import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from "./base.model";

@Entity('PaymentAccount')
export class PaymentAccount extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.gateway = '';
        this.customerID = '';
        this.paymentMethodID = '';
        this.tag = '';
    }

    @Attribute()
    type: string;
    @Attribute()
    gateway: string;
    @Attribute()
    customerID: string;
    @Attribute()
    paymentMethodID: string;
    @Attribute()
    tag: string;
}