import { IBaseDTO } from "./i.base.dto";

export interface ITokenDTO extends IBaseDTO {
  references: number[];
}