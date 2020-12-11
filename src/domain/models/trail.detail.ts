import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { BillBoard } from "./bill.board";
import { Media } from "./media";

export class TrailDetailContentIncludeAddToCart {
    constructor() {
        this.icon = false;
        this.text = false;
        this.button = false;
        this.caption = '';
    }

    @Attribute()
    icon?: boolean;
    @Attribute()
    text: boolean;
    @Attribute()
    button?: boolean;
    @Attribute()
    caption: string;
}

export class TrailDetailContent {
    constructor() {
    }

    @Attribute()
    price?: string;
    @Attribute()
    includeAddToCart?: TrailDetailContentIncludeAddToCart;
    @Attribute()
    copy?: string;
    @Attribute()
    photo?: Media;
}

export class TrailDetailSection {
    constructor() {
        this.type = '';
        this.contents = [];
        this.sequence = -1;
    }

    @Attribute()
    type: string;
    @Attribute()
    contents: TrailDetailContent[];
    @Attribute()
    sequence: number;
}

@Entity('TrailDetail')
export class TrailDetail extends BaseModel {
    constructor() {
        super();
        this.title = '';
        this.personas = [];
        this.sections = [];
    }

    @Attribute()
    title: string;
    @Attribute()
    personas: BillBoard[];
    @Attribute()
    sections: TrailDetailSection[];
}