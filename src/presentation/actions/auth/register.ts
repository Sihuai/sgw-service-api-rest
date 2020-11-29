import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { UserServiceImpl } from '../../../app/service/impl/user.service.impl';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO, User } from '../../../domain/models/user';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IUserDTO> {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  nick: string;
  pwhash: string;
}

@provide(IOC_TYPE.RegisterUserAction, true)
@provide('action', true)
export class RegisterUserAction implements IAction {
  payloadExample = `
  "email": "email@sgw.com",
  "firstName": "firstName",
  "lastName": "lastName",
  "userName": "username",
  "nick": "nick",
  "pwhash": "48ab1d7a4f1d0f231ca46d9cc865c66f"
  `;
  description = '';

  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserServiceImpl,
  ) { }
  async execute(request: IRequest) : Promise<any> {
    if (isEmptyObject(request.email) == true) return -1; // Email is empty!
    if (isEmptyObject(request.pwhash) == true) return -2; // Password is empty!
    if (isEmptyObject(request.nick) == true) return -3; // Nike is empty!

    const datetimeNow = moment();
    
    const user = new User();
    user.email = request.email;
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.userName = request.userName;
    user.nick = request.nick;
    user.pwhash = request.pwhash;
    user.isActive = true;
    user.datetimeCreated = datetimeNow.clone().format('YYYY-MM-DD HH:mm:ss');
    user.userCreated = user.email;

    return await this.userService.addOne(user);
  }
}
