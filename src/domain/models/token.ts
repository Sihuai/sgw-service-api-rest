import { Document, Entity, Collection, Entities, Index, Attribute } from 'type-arango'

@Document()
export class Token extends Entity {
    constructor() {
        super();
        this.email = '';
        this.token = '';
    }

    @Index()
    @Attribute(type => type.email())
    email: string;
    @Attribute()
    token: string;
}

export interface ITokenMainFields {
    body: string;
    subject?: string;
}
  
export interface ITokenDTO extends ITokenMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}


@Collection(of => Token)
export class Tokens extends Entities {
    static select(filters) {
        const token = Tokens.findOne({filter:filters});
        if(!token) return null;
		return token;
    }

    static delete(filters) {
        const token = this.select(filters);
        token.remove();
    }
}