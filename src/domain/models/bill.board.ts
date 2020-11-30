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
    // @OneToMany(type => Category, Category => Category.owner)
    // contents: Related<Category[]>;
    contents: Category[];
}

export interface IBillBoardMainFields {
    body: string;
    subject?: string;
}
  
export interface IBillBoardDTO extends IBillBoardMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}