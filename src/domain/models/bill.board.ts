import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Category } from './category';

@Entity('BillBoard')
export class BillBoard extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.contents = [];
    }

    @HashIndex({ unique: true, name: 'ix_billboard_sequence' })
    @Attribute()
    type: string;
    @Attribute()
    contents: Category[];
}

export interface IBillBoardMainFields {
    body: string;
}
  
export interface IBillBoardDTO extends IBillBoardMainFields {
    references: number[];
    threadId: number;
}