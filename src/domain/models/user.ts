import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

@Entity("Users")
export class User extends BaseModel {
    constructor() {
        super();
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.userName = '';
        this.nick = '';
        this.pwhash = '';
        this.role = '';
    }

    @HashIndex({ unique: true, name: "ix_user_email" })  // creates a hash index on User.email
    @Attribute()                                // validates changes to user.email to be email addresses type => type.email()
    email: string;
    @Attribute()
    firstName: string;
    @Attribute()
    lastName: string;
    @Attribute()
    userName: string;
    @Attribute()
    nick: string;
    @Attribute()
    pwhash: string;
    @Attribute()
    role: string;
}

export interface IUserMainFields {
    body: string;
    subject?: string;
}
  
export interface IUserDTO extends IUserMainFields {
    attachmentIds: number[];
    references: number[];
    threadId: number;
}