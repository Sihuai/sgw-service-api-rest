import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Wallet } from '../../../domain/models/wallet';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteWalletAction, true)
@provide('action', true)
export class DeleteWalletAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    // @inject(IOC_TYPE.WalletServiceImpl) private addressService: WalletService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Wallet();
    model._key = key;
    model.userLastUpdated = token.email;

    return null;
  }
}
