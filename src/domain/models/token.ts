import { Document, Entity, Collection, Entities, Index, Attribute } from 'type-arango'

@Document()
export class Token extends Entity {
    @Index()                            // creates a hash index on User.email
    @Attribute(type => type.email())    // validates changes to user.email to be email addresses
    email?: string;
    @Attribute()
    token?: string;

    static create(email: string, token: string) {
        return new Token({ email, token });
    }
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