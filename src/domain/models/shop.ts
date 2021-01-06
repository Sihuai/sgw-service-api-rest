import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { ShopTypes } from "../enums/shop.types";
import { BaseModel } from './base.model';
import { Media } from './media';

export class Poster extends Media {
  constructor() {
    super();
    this.tag = '';
  }
  @Attribute()
  tag: string;
}

@Entity('Shop')
export class Shop extends BaseModel {
    constructor() {
        super();
        this.name = '';
        this.type = ShopTypes.TRAILSSHOPS;
        this.isLocked = false;
        this.posters = [];
    }

    @Attribute()
    sequence?: number;
    @HashIndex({ unique: true, name: 'ix_shop_name' })
    @Attribute()
    name: string;
    @Attribute()
    type: ShopTypes;
    @Attribute()
    isLocked: boolean;
    @Attribute()
    posters: Poster[];
}