import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from "./base.model";

@Entity('Address')
export class Address extends BaseModel {
    constructor() {
        super();
        this.country = '';
        this.block = '';
        this.propertyName = '';
        this.street = '';
        this.unit = '';
        this.isDefault = false;
        this.recipient = '';
        this.mobile = '';
    }

    @Attribute()
    country: string;
    @Attribute()
    block: string;
    @Attribute()
    propertyName: string;
    @Attribute()
    street: string;
    @Attribute()
    unit: string;
    @Attribute()
    province?: string;
    @Attribute()
    city?: string;
    @Attribute()
    postal?: string;
    @Attribute()
    isDefault: boolean;
    @Attribute()
    recipient: string;
    @Attribute()
    mobile: string;
}