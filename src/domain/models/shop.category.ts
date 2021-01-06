import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { ShopTypes } from "../enums/shop.types";
import { ShopViewTypes } from "../enums/shop.view.types";
import { BaseModel } from './base.model';
import { Product } from "./product";
import { Shop } from "./shop";

export class Category {
  constructor() {
    this.sequence = -1;
    this.name = '';
    this.color = '';
    this.type = ShopViewTypes.ALL;
  }

  @Attribute()
  sequence: number;
  @Attribute()
  name: string;
  @Attribute()
  color: string;
  @Attribute()
  type: ShopViewTypes;

  products?: Product[];
  shops?: Shop[];
}

@Entity('ShopCategory')
export class ShopCategory extends BaseModel {
  constructor() {
    super();
    this.type = ShopTypes.TRAILSSHOPS;
  }
  
  @Attribute()
  type: ShopTypes;
  @Attribute()
  categories?: Category[];
  @Attribute()
  trails?: Category[];
}