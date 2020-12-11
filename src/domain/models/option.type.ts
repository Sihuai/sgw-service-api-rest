import { Attribute, Entity } from "../../infra/utils/oct-orm";
import { BaseModel } from "./base.model";

@Entity('OptionType')
export class OptionType extends BaseModel {
    constructor() {
        super();
        this.type = -1;
        this.code = '';
        this.name = '';
        this.sequence = -1;
        this.selected = false;
    }

    @Attribute()
    type: number;
    @Attribute()
    code: string;
    @Attribute()
    name: string;
    @Attribute()
    sequence: number;
    @Attribute()
    selected: boolean;
}