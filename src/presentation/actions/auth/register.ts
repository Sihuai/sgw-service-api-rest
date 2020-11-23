import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO, User } from '../../../domain/models/user';
import { INullable } from '../../../infra/utils/types';

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
  "username": "username",
  "nick": "nick",
  "pwhash": "48ab1d7a4f1d0f231ca46d9cc865c66f"
  `;
  description = '';

  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
  ) { }
  async execute(request: IRequest) {
    const user = new User();
    user.email = request.email;
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.userName = request.userName;
    user.nick = request.nick;
    user.pwhash = request.pwhash;

    return this.userService.add(user);
  }
}
