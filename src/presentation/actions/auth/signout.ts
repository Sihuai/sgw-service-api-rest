import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { TokenService } from '../../../app/service/token.service';
import { IOC_TYPE } from '../../../config/type';
import { ITokenDTO } from '../../../domain/models/token';
import { INullable } from '../../../infra/utils/types';

interface IRequest extends INullable<ITokenDTO> {
  // email: string;
  token: string;
}

@provide(IOC_TYPE.SignoutAuthAction, true)
@provide('action', true)
export class SignoutAuthAction implements IAction {
  payloadExample = `
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp......",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TokenService) public tokenService: TokenService,
  ) { }
  async execute(request: IRequest) {
    const filters = {token:request.token};
    this.tokenService.remove(filters);
  }
}
