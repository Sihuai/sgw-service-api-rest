import { IBaseDTO } from "./i.base.dto";

export interface IPaymentAccountDTO extends IBaseDTO {
  number: string;
  cvc: string;
  expMonth: number;
  expYear: number;
}