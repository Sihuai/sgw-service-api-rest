import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('TrailAnimationPlayback')
export class TrailAnimationPlayback extends BaseModel {
    constructor() {
        super();
    }
}