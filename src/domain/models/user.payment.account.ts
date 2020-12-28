import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('UserPaymentAccount')
export class UserPaymentAccount extends BaseModel {
    constructor() {
        super();
    }
}