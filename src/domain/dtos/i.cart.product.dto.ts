import { IBaseDTO } from "./i.base.dto";

export interface ICartProductDTO extends IBaseDTO {
  references: number[];
}