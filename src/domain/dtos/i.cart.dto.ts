import { IBaseDTO } from "./i.base.dto";

export interface ICartDTO extends IBaseDTO {
  references: number[];
}