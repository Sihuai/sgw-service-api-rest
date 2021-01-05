import { IBaseDTO } from "./i.base.dto";

export interface IProductCategoryDTO extends IBaseDTO {
  _key: string;
  sequence: number;
  name: string;
  description: string;
}