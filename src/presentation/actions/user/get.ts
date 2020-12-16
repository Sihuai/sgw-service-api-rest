import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { UserService } from '../../../app/service/user.service';

@provide(IOC_TYPE.GetUserAction, true)
@provide('action', true)
export class GetUserAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
  ) { }
  async execute(token) : Promise<any>  {
    if (isEmptyObject(token) == true) return -1; // User is empty!

    const filters = {email:token.email, isActive:true};
    
    return await this.userService.findOneBy(filters);
  }
}