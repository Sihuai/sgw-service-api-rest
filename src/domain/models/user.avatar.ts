import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('UserAvatar')
export class UserAvatar extends BaseModel {
    constructor() {
        super();
        this.avatar = '';
    }

    @Attribute()
    avatar: string;
}