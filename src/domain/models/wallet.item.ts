import moment from "moment";
import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { DiscountTargetTypes } from "../enums/discount.target.types";
import { DiscountTypes } from "../enums/discount.types";
import { DiscountUOMTypes } from "../enums/discount.uom.types";
import { BaseModel } from './base.model';

export class Option {
    constructor() {
    }

    @Attribute()
    discount?: Discount;
    @Attribute()
    sampler?: string;
}

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

@Entity('WalletItem')
export class WalletItem extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.name = '';
        this.description = '';
        this.sn = '';
        this.expire = moment().utc().format('YYYY-MM-DD');
        this.option = '';
        this.tag = '';
    }

    @Attribute()
    type: string;
    @Attribute()
    name: string;
    @Attribute()
    description: string;
    @Attribute()
    sn: string;
    @Attribute()
    expire: string;
    @Attribute()
    option: string;
    @Attribute()
    tag: string;
}