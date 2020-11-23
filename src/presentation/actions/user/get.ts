import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO } from '../../../domain/models/user';
import { INullable } from '../../../infra/utils/types';

interface IRequest extends INullable<IUserDTO> {
  email: string;
  isActive: boolean;
}

@provide(IOC_TYPE.GetUserAction, true)
@provide('action', true)
export class GetUserAction implements IAction {
  payloadExample = `
    "email": "email@sgw.com",
    "isActive": true,
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
  ) { }
  async execute(request: IRequest) {
    const filters = {email:request.email, isActive:request.isActive};
    return this.userService.find(filters);
  }
}