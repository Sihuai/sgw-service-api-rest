import { IBaseDTO } from "./i.base.dto";

export interface IUserDTO extends IBaseDTO {
  references: number[];
}