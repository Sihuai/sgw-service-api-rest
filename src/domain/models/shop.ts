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
        this.type = ShopTypes.TRAILSSHOPS;
        this.name = '';
        this.isLocked = false;
        this.posters = [];
    }

    @Attribute()
    sequence?: number;
    @Attribute()
    type: ShopTypes;
    @HashIndex({ unique: true, name: 'ix_shop_name' })
    @Attribute()
    name: string;
    @Attribute()
    isLocked: boolean;
    @Attribute()
    posters: Poster[];
}