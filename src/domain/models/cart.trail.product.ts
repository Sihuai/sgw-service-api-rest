import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('CartTrailProduct')
export class CartTrailProduct extends BaseModel {
    constructor() {
        super();
    }
}