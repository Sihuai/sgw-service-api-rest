import { Document, Collection, Entities, Index, Attribute } from 'type-arango'
import { Media } from './media';

@Document()
export class Category extends Media {
    constructor() {
        super();
        this.sequence = -1;
        this.name = '';
        this.tag = '';
    }

    @Index()
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