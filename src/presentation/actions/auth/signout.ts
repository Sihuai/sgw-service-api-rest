import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { TokenServiceImpl } from '../../../app/service/impl/token.service.impl';
import { IOC_TYPE } from '../../../config/type';
import { ITokenDTO, Token } from '../../../domain/models/token';
import { INullable } from '../../../infra/utils/types';

interface IRequest extends INullable<ITokenDTO> {
  email: string;
}

@provide(IOC_TYPE.SignoutAuthAction, true)
@provide('action', true)
export class SignoutAuthAction implements IAction {
  payloadExample = `
    "token": "54dr99sss.....",
    "email": "email@sgw.com",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TokenServiceImpl) public tokenService: TokenServiceImpl,
  ) { }
  async execute(token: string, request: IRequest) : Promise<any> {
    const model = new Token();
    model.token = token;
    model.email = request.email;

    return await this.tokenService.removeOne(model);
  }
}
