import { Document, Collection, Entities, Index, Attribute } from 'type-arango'
import { BaseModel } from './base.model';

@Document()
export class User extends BaseModel {
    @Index()                            // creates a hash index on User.email
    @Attribute(type => type.email())    // validates changes to user.email to be email addresses
    email?: string;
    @Attribute()
    firstName?: string;
    @Attribute()
    lastName?: string;
    @Attribute()
    userName?: string;
    @Attribute()
    nick?: string;
    @Attribute()
    pwhash?: string;
    @Attribute()
    role?: string;
    @Attribute()
    isActive?: boolean;

    // static create(email: string, name: UserName, username: string, nick: string, pwhash: string) {
    //     return new User({ email, name, username, nick, pwhash });
    // }

    static create(email: string, firstName: string, lastName: string, userName: string, nick: string, pwhash: string, role?: string, isActive?: boolean) {
        return new User({ email, firstName, lastName, userName, nick, pwhash, role, isActive });
    }
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


// creates the collection Users
@Collection(of => User)
export class Users extends Entities {
    // creates & documents a route on /users/custom/:user
	// @Route.GET('custom/:user=number')
	// static GET_CUSTOM({param,error}: RouteArg){
	// 	const user = Userses.findOne(param.user);
	// 	if(!user) return error('not found');
	// 	return user;
    // }

    static select(filters) {
        const user = Users.findOne({filter:filters});
        if(!user) return null;
		return user;
    }

    // static resetpwrequest(filters) {
    //     const vcode = createVerificationCode();
    //     const datetimeNow = moment();

    //     return this.save(model);
    // }

    // static resetpwexecute(filters) {
    //     const vcode = createVerificationCode();
    //     const datetimeNow = moment();

    //     return this.save(model);
    // }
}