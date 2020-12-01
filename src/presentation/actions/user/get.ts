import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { UserServiceImpl } from '../../../app/service/impl/user.service.impl';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO } from '../../../domain/models/user';
import { INullable } from '../../../infra/utils/types';
import { isEmptyObject } from '../../../infra/utils/data.validator';

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
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserServiceImpl,
  ) { }
  async execute(request: IRequest) : Promise<any>  {
    if (isEmptyObject(request.email) == true) return -1; // Email is empty!

    const filters = {email:request.email, isActive:request.isActive};
    
    return await this.userService.findOne(filters);
  }
}