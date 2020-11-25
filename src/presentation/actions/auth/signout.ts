import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { TokenServiceImpl } from '../../../app/service/impl/token.service.impl';
import { IOC_TYPE } from '../../../config/type';
import { ITokenDTO } from '../../../domain/models/token';
import { INullable } from '../../../infra/utils/types';

// interface IRequest extends INullable<ITokenDTO> {
//   // email: string;
//   token: string;
// }

@provide(IOC_TYPE.SignoutAuthAction, true)
@provide('action', true)
export class SignoutAuthAction implements IAction {
  payloadExample = `
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp......",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TokenServiceImpl) public tokenService: TokenServiceImpl,
  ) { }
  async execute(token: string) {
    const filters = {token:token};
    this.tokenService.remove(filters);
  }
}
