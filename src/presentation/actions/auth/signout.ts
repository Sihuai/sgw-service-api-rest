import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { Token } from '../../../domain/models/token';
import { TokenService } from '../../../app/service/token.service';

@provide(IOC_TYPE.SignoutAuthAction, true)
@provide('action', true)
export class SignoutAuthAction implements IAction {
  payloadExample = `
    "token": "54dr99sss.....",
    "email": "email@sgw.com",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TokenServiceImpl) private tokenService: TokenService,
  ) { }
  async execute(token: string, email: string) : Promise<any> {
    const model = new Token();
    model.token = token;
    model.email = email;

    return await this.tokenService.removeOne(model);
  }
}
