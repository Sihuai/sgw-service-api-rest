import { IBaseDTO } from "./i.base.dto";

export interface ICategoryDTO extends IBaseDTO {
  references: number[];
}