import { Entity, Attribute } from "../../infra/utils/oct-orm";

@Entity()
export class Token {
    constructor() {
        this._id = '';
        this._key = '';
        this._rev = '';
        this.email = '';
        this.token = '';
    }

    @Attribute()
    public _id?: string;
    @Attribute()
    public _key?: string;
    @Attribute()
	public _rev?: string;
    // @Index()type => type.email()
    @Attribute()
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