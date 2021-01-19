import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Coupon } from "./coupon";

@Entity('UserWallet')
export class UserWallet extends BaseModel {
    constructor() {
        super();
        this.coupons = [];
        this.tag = '';
    }

    @Attribute()
    coupons: Coupon[];
    @Attribute()
    tag: string;
}