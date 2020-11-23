import { Document, Entity, Collection, Entities, Index, Attribute, Related, OneToMany } from 'type-arango'
import { BaseModel } from './base.model';
import { Category } from './category';

@Document()
export class BillBoard extends BaseModel {
    @Index()
    @Attribute()
    type?: number;
    @Attribute()
    @OneToMany(type => Category, Category => Category.owner)
    contents?: Related<Category[]>;
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


@Collection(of => BillBoard)
export class BillBoards extends Entities {
    static select(filters) {
        const result = BillBoards.findOne({filter:filters});
        if(!result) return null;
		return result;
    }
}