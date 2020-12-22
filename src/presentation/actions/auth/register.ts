import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO } from '../../../domain/dtos/i.user.dto';
import { User } from '../../../domain/models/user';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IUserDTO> {
  email: string;
  nameFirst: string;
  nameLast: string;
  pwhash: string;
}

@provide(IOC_TYPE.RegisterUserAction, true)
@provide('action', true)
export class RegisterUserAction implements IAction {
  payloadExample = `
  "email": "email@sgw.com",
  "firstName": "firstName",
  "lastName": "lastName",
  "pwhash": "48ab1d7a4f1d0f231ca46d9cc865c66f"
  `;
  description = '';

  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) { }
  async execute(request: IRequest) : Promise<any> {
    if (isEmptyObject(request.email) == true) return -1; // Email is empty!
    if (isEmptyObject(request.pwhash) == true) return -2; // Password is empty!
    if (isEmptyObject(request.nameFirst) == true) return -3; // First name is empty!
    if (isEmptyObject(request.nameLast) == true) return -4; // Last name is empty!

    const model = new User();
    model.email = request.email;
    model.nameFirst = request.nameFirst;
    model.nameLast = request.nameLast;
    model.pwhash = request.pwhash;
    model.isActive = true;
    model.role = 'Guest';
    model.userCreated = model.email;

    return await this.userService.addOne(model);
  }
}
