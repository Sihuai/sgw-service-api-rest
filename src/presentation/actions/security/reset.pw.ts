import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { INullable } from '../../../infra/utils/types';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IUserDTO } from '../../../domain/dtos/i.user.dto';
import { UserService } from '../../../app/service/user.service';
import moment from 'moment';

interface IRequest extends INullable<IUserDTO> {
  oldpw: string;
  newpw: string;
}

@provide(IOC_TYPE.ResetPWAction, true)
@provide('action', true)
export class ResetPWAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) { }
  async execute(token, request: IRequest) : Promise<any>  {
    if (isEmptyObject(request.oldpw) == true) return -1; // Old Password is empty!
    if (isEmptyObject(request.newpw) == true) return -2; // New Password is empty!

    const filters = {email:token.email, isActive:true};
    const user = await this.userService.findOneBy(filters);
    if (isEmptyObject(user) == true) return -3; // User isnot existed!;

    if (user.pwhash != request.oldpw) return -4; // Old Password is wrong!;

    user.pwhash = request.newpw;
    user.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    user.userLastUpdated = token.email;

    return await this.userService.resetPW(user);
  }
}