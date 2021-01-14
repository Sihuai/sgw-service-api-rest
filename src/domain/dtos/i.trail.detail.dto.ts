import { BillBoard } from "../models/bill.board";
import { TrailDetailSection } from "../models/trail.detail";
import { IBaseDTO } from "./i.base.dto";

export interface ITrailDetailDTO extends IBaseDTO {
  _key: string;
  trailkey: string;
  name: string;
  personas: BillBoard[];
  sections: TrailDetailSection[];
}