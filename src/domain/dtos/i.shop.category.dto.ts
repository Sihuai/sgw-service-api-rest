import { ShopTypes } from "../enums/shop.types";
import { Category } from "../models/shop.category";
import { IBaseDTO } from "./i.base.dto";

export interface IShopCategoryDTO extends IBaseDTO {
  _key: string;
  type: ShopTypes;
  categories: Category[];
  trails: Category[];
}