import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";

export class Address {
    constructor() {
        this.country = '';
        this.block = '';
        this.propertyName = '';
        this.street = '';
        this.unit = '';
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
}