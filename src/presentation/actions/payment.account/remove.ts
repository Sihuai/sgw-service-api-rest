import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { PaymentAccountService } from '../../../app/service/payment.account.service';
import { IOC_TYPE } from '../../../config/type';
import { PaymentAccount } from '../../../domain/models/payment.account';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.RemovePaymentAccountAction, true)
@provide('action', true)
export class RemovePaymentAccountAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.PaymentAccountServiceImpl) private paymentaccountService: PaymentAccountService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new PaymentAccount();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.paymentaccountService.removeOne(model);
  }
}
