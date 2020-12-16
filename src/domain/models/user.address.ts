import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('UserAddress')
export class UserAddress extends BaseModel {
    constructor() {
        super();
    }
}