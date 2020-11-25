import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Category } from './category';

@Entity()
export class BillBoard extends BaseModel {
    constructor() {
        super();
        this.type = -1;
        this.contents = [];
    }

    // @Index()
    @Attribute()
    type: number;
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


@Collection(of => BillBoard)
export class BillBoards extends Entities {
    static select(filters) {
        const result = BillBoards.findOne({filter:filters});
        if(!result) return null;
		return result;
    }
}