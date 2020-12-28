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
        this.nameFirst = '';
        this.nameLast = '';
        this.nick = '';
        this.gender = '';
        this.pwhash = '';
        this.role = '';
        this.headerUri = '';
        this.dob = '';
    }

    @HashIndex({ unique: true, name: 'ix_user_email' })     // creates a hash index on User.email
    @Attribute()                                            // validates changes to user.email to be email addresses type => type.email()
    email: string;
    @Attribute()
    nameFirst: string;
    @Attribute()
    nameLast: string;
    @Attribute()
    nick: string;
    @Attribute()
    gender: string;
    @Attribute()
    dob: string;
    @Attribute()
    headerUri: string;
    @Attribute()
    pwhash: string;
    @Attribute()
    role: string;
    @Attribute()
    address?: Address[];
    @Attribute()
    resetToken?: ResetToken;
}