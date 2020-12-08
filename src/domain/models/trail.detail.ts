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
        this.contents = new TrailDetailContent();
        this.sequence = -1;
    }

    @Attribute()
    type: string;
    @Attribute()
    contents: TrailDetailContent;
    @Attribute()
    sequence: number;
}

@Entity('TrailDetail')
export class TrailDetail extends BaseModel {
    constructor() {
        super();
        this.title = '';
        this.billboard = new BillBoard();
        this.sections = new TrailDetailSection();
    }

    @Attribute()
    title: string;
    @Attribute()
    billboard: BillBoard;
    @Attribute()
    sections: TrailDetailSection;
}