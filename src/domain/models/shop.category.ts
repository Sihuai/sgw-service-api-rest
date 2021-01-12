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

  sequence: number;
  name: string;
  color: string;
  type: ShopViewTypes;

  products?: Product[];
  shops?: Shop[];
}

export class ShopCategory extends BaseModel {
  constructor() {
    super();
    this.type = ShopTypes.TRAILSSHOPS;
  }
  
  type: ShopTypes;
  categories?: Category[];
  trails?: Category[];
}