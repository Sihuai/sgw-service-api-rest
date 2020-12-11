import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Address } from "./address";
import { BaseModel } from './base.model';

export class ResetToken {
    constructor() {
        this.dateRequested = '';
        this.dateExpires = '';
        this.code = '';
        this.resolved = false;
    }
  
    @Attribute()
    dateRequested: string;
    @Attribute()
    dateExpires: string;
    @Attribute()
    code: string;
    @Attribute()
    resolved: boolean;
  }

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
        // this.resetToken = undefined;
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
    address?: Address;
    @Attribute()
    resetToken?: ResetToken;
}