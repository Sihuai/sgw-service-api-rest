import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { INullable } from '../../../infra/utils/types';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IUserDTO } from '../../../domain/dtos/i.user.dto';
import { UserService } from '../../../app/service/user.service';

interface IRequest extends INullable<IUserDTO> {
  email: string;
  pwhash: string;
  code: string;
}

@provide(IOC_TYPE.ResetPWExecuteUserAction, true)
@provide('action', true)
export class ResetPWExecuteUserAction implements IAction {
  payloadExample = `
    "email": "email@sgw.com",
    "pwhash": "des52ed4sdsa225893...",
    "code": "des52ed4sdsa225893...",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
  ) { }
  async execute(request: IRequest) : Promise<any>  {
    if (isEmptyObject(request.email) == true) return -1; // Email is empty!
    if (isEmptyObject(request.pwhash) == true) return -2; // Password is empty!
    if (isEmptyObject(request.code) == true) return -3; // code is empty!

    const filters = {email:request.email, 'resetToken.code':request.code};
    
    return await this.userService.resetPWExecute(filters, request.pwhash);
  }
}