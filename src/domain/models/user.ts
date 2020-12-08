import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { ResetToken } from "./reset.token";

@Entity('Users')
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
        this.resetToken = undefined;
    }

    @HashIndex({ unique: true, name: 'ix_user_email' })     // creates a hash index on User.email
    @Attribute()                                            // validates changes to user.email to be email addresses type => type.email()
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
    @Attribute()
    resetToken?: ResetToken;
}

export interface IUserMainFields {
    body: string;
}
  
export interface IUserDTO extends IUserMainFields {
    references: number[];
    threadId: number;
}