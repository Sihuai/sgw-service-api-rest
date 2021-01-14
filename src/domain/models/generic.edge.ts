import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('GenericEdge')
export class GenericEdge extends BaseModel {
  constructor() {
    super();
  }

  @Attribute()
  sequence?: number;
  @Attribute()
  tag?: string;
}