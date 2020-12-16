import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('CartCartDetail')
export class CartCartDetail extends BaseModel {
    constructor() {
        super();
    }
}