import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";

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
    @HashIndex({ unique: true, name: "ix_token_email" })
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