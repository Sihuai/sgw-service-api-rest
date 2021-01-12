import { CouponTypes } from "../enums/coupon.types";
import { Option } from "../models/coupon";
import { IBaseDTO } from "./i.base.dto";

export interface ICouponDTO extends IBaseDTO {
  _key: string;
  type: CouponTypes;
  name: string;
  description: string;
  hasMaxLimit: boolean;
  maxLimit: number;
  expire: string;
  option: Option;
}