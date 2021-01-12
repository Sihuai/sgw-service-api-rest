import { IBaseDTO } from "./i.base.dto";

export interface IGenericEdgeDTO extends IBaseDTO {
  fromkey: string;
  tokey: string;
}