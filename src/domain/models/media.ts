import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('Media')
export class Media extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.orientation = '';
        this.format = '';
        this.uri = '';
    }

    @Attribute()
    type: string;
    @Attribute()
    orientation: string;
    @Attribute()
    format: string;
    @Attribute()
    uri: string;
}