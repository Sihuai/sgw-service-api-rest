import { ShopTypes } from "../enums/shop.types";
import { Poster } from "../models/shop";
import { IBaseDTO } from "./i.base.dto";

export interface IShopDTO extends IBaseDTO {
  _key: string;
  sequence: number;
  name: string;
  type: ShopTypes;
  isLocked: boolean;
  posters: Poster[];
}