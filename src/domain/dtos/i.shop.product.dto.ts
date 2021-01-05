import { IBaseDTO } from "./i.base.dto";

export interface IShopProductDTO extends IBaseDTO {
  productkey: string;
  shopkey: string;
}