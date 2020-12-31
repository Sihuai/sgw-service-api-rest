import { IBaseDTO } from "./i.base.dto";

export interface IPaymentDTO extends IBaseDTO {
  orderkey: string;
  paymentaccountkey: string;
}