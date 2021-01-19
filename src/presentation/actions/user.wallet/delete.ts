import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { UserWallet } from '../../../domain/models/user.wallet';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteUserWalletAction, true)
@provide('action', true)
export class DeleteUserWalletAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    // @inject(IOC_TYPE.UserWalletServiceImpl) private addressService: UserWalletService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new UserWallet();
    model._key = key;
    model.userLastUpdated = token.email;

    return null;
  }
}
