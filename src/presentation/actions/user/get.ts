import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { UserServiceImpl } from '../../../app/service/impl/user.service.impl';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';

@provide(IOC_TYPE.GetUserAction, true)
@provide('action', true)
export class GetUserAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserServiceImpl,
  ) { }
  async execute(user) : Promise<any>  {
    if (isEmptyObject(user) == true) return -1; // User is empty!

    const filters = {email:user.email, isActive:true};
    
    return await this.userService.findOneBy(filters);
  }
}