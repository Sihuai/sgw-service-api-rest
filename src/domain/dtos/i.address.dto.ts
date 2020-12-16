import { IBaseDTO } from "./i.base.dto";

export interface IAddressDTO extends IBaseDTO {
  references: number[];
}