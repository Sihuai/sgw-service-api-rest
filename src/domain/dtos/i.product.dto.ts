import { Media } from "../models/media";
import { OptionType } from "../models/option.type";
import { Price } from "../models/price";
import { Option } from "../models/product";
import { IBaseDTO } from "./i.base.dto";

export interface IProductDTO extends IBaseDTO {
  _key: string;
  sku: string;
  name: string;
  description: string;
  options: Option;
  delivery: OptionType[];
  price: Price;
  posters: Media[];
}