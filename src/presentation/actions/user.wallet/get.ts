import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { UserWalletService } from '../../../app/service/user.wallet.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetUserWalletAction, true)
@provide('action', true)
export class GetUserWalletAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserWalletServiceImpl) private userWalletService: UserWalletService,
  ) { }
  async execute(token) : Promise<any>  {

    const filters = {userCreated:token.email, isActive:true};
    return await this.userWalletService.findAllBy(filters);
  }
}