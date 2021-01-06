import { IBaseDTO } from "./i.base.dto";

export interface IProductBrandDTO extends IBaseDTO {
  _key: string;
  sequence: number;
  name: string;
  description: string;
}