import { Poster } from "../models/shop";
import { IBaseDTO } from "./i.base.dto";

export interface IShopDTO extends IBaseDTO {
  _key: string;
  sequence: number;
  name: string;
  isLocked: boolean;
  posters: Poster[];
}