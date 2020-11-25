import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { Media } from './media';

@Entity()
export class Category extends Media {
    constructor() {
        super();
        this.sequence = -1;
        this.name = '';
        this.tag = '';
    }

    // @Index()
    @Attribute()
    sequence: number;
    @Attribute()
    name: string;
    @Attribute()
    tag: string;
}

export interface ICategoryMainFields {
    body: string;
    subject?: string;
}
  
export interface ICategoryDTO extends ICategoryMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}


@Collection(of => Category)
export class Categorys extends Entities {
    static select(filters) {
        const result = Categorys.findOne({filter:filters});
        if(!result) return null;
		return result;
    }
}