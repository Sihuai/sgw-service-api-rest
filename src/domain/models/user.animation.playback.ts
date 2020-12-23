import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('UserAnimationPlayback')
export class UserAnimationPlayback extends BaseModel {
    constructor() {
        super();
    }
}