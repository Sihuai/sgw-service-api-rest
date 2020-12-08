import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity('SectionTrail')
export class SectionTrail extends BaseModel {
    constructor() {
        super();
    }
}

export interface ISectionTrailMainFields {
    body: string;
}
  
export interface ISectionTrailDTO extends ISectionTrailMainFields {
    references: number[];
    threadId: number;
}