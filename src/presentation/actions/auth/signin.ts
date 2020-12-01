import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { TokenServiceImpl } from '../../../app/service/impl/token.service.impl';
import { UserServiceImpl } from '../../../app/service/impl/user.service.impl';
import { IOC_TYPE } from '../../../config/type';
import { ITokenDTO } from '../../../domain/models/token';
import { INullable } from '../../../infra/utils/types';
import { isEmptyObject } from '../../../infra/utils/data.validator';

interface IRequest extends INullable<ITokenDTO> {
  email: string;
  pwhash: string;
}

@provide(IOC_TYPE.SigninAuthAction, true)
@provide('action', true)
export class SigninAuthAction implements IAction {
  payloadExample = `
    "email": "email@sgw.com",
    "pwhash": "48ab1d7a4f1d0f231ca46d9cc865c66f",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserServiceImpl,
    @inject(IOC_TYPE.TokenServiceImpl) public tokenService: TokenServiceImpl,
  ) { }
  async execute(request: IRequest) : Promise<any> {
    if (isEmptyObject(request.email) == true) return -1; // Email is empty!
    if (isEmptyObject(request.pwhash) == true) return -2; // Password is empty!

    const filters = {email:request.email, pwhash:request.pwhash};
    
    const user = await this.userService.findOne(filters);
    if (user == null) return -3; // Fail to authenticate user credential passed in.
    
    return await this.tokenService.addOne(user);
  }
}