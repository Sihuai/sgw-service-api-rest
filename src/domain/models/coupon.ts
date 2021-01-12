import moment from "moment";
import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { CouponTypes } from "../enums/coupon.types";
import { DiscountTargetTypes } from "../enums/discount.target.types";
import { DiscountTypes } from "../enums/discount.types";
import { DiscountUOMTypes } from "../enums/discount.uom.types";
import { BaseModel } from './base.model';

export class DiscountTarget {
    constructor() {
        this.type = DiscountTargetTypes.PRODUCT;
    }

    @Attribute()
    type: DiscountTargetTypes;
}

export class Discount {
    constructor() {
        this.type = DiscountTypes.PERCENTAGE;
        this.value = 0;
        this.uom = DiscountUOMTypes.PERCENTAGE;
        this.deductFromOrderAmount = true;
        this.incrementOrderQty = false;
        this.targets = [];
    }

    @Attribute()
    type: DiscountTypes;
    @Attribute()
    value: number;
    @Attribute()
    uom: DiscountUOMTypes;
    @Attribute()
    deductFromOrderAmount: boolean;
    @Attribute()
    incrementOrderQty: boolean;
    @Attribute()
    targets: DiscountTarget[];
}

export class Option {
    constructor() {
    }

    @Attribute()
    discount?: Discount;
    @Attribute()
    sampler?: string;
    @Attribute()
    purchase?: number;
}

@Entity('Coupon')
export class Coupon extends BaseModel {
    constructor() {
        super();
        this.type = CouponTypes.DISCOUNT;
        this.name = '';
        this.description = '';
        this.hasMaxLimit = false;
        this.maxLimit = 0;
        this.expire = moment().utc().format('YYYY-MM-DD');
        this.option = new Option();
    }

    @Attribute()
    type: CouponTypes;
    @Attribute()
    name: string;
    @Attribute()
    description: string;
    @Attribute()
    hasMaxLimit: boolean;
    @Attribute()
    maxLimit: number;
    @Attribute()
    expire: string;
    @Attribute()
    option: Option;
}