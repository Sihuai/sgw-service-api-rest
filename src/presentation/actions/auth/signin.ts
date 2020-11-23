import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { TokenService } from '../../../app/service/token.service';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { ITokenDTO } from '../../../domain/models/token';
import { INullable } from '../../../infra/utils/types';

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
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
    @inject(IOC_TYPE.TokenServiceImpl) public tokenService: TokenService,
  ) { }
  async execute(request: IRequest) {
    const filters = {email:request.email, pwhash:request.pwhash};
    
    const user = await this.userService.find(filters);
    if (user == null) return null;

    return this.tokenService.create(user);
  }
}
