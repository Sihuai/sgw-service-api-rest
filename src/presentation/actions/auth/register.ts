import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO, User } from '../../../domain/models/user';
import { INullable } from '../../../infra/utils/types';

interface IRequest extends INullable<IUserDTO> {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  nick: string;
  pwhash: string;
}

@provide(IOC_TYPE.RegisterUserAction, true)
@provide('action', true)
export class RegisterUserAction implements IAction {
  payloadExample = `
  "email": "email@sgw.com",
  "name": "{"first":"first name", "last":"last name"}",
  "username": "username",
  "nick": "nick",
  "pwhash": "48ab1d7a4f1d0f231ca46d9cc865c66f"
  `;
  description = '';

  constructor(
    @inject(IOC_TYPE.UserService) public userService: UserService,
  ) { }
  async execute(request: IRequest) {
    const user = User.create(request.email, request.firstname, request.lastname, request.username, request.nick, request.pwhash);
    return this.userService.add(user);
  }
}
