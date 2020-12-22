import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { UserService } from '../../../app/service/user.service';

@provide(IOC_TYPE.GetUserAction, true)
@provide('action', true)
export class GetUserAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) { }
  async execute(token) : Promise<any>  {
    const filters = {email:token.email, isActive:true};
    
    const user = await this.userService.findOneBy(filters);
    user.pwhash = '';

    return user;
  }
}