import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { TokenServiceImpl } from '../../../app/service/impl/token.service.impl';
import { IOC_TYPE } from '../../../config/type';

@provide(IOC_TYPE.GetTokenAction, true)
@provide('action', true)
export class GetTokenAction implements IAction {
  payloadExample = `
  "token": "54dr99sss....."
  `;
  description = '';

  constructor(
    @inject(IOC_TYPE.TokenServiceImpl) public tokenService: TokenServiceImpl,
  ) { }
  async execute(token: string) : Promise<any> {
    const filters = {token:token};
    
    return await this.tokenService.refresh(filters);
  }
}
