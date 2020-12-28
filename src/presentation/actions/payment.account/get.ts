import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { PaymentAccountService } from '../../../app/service/payment.account.service';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetPaymentAccountAction, true)
@provide('action', true)
export class GetPaymentAccountAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.PaymentAccountServiceImpl) private paymentaccountService: PaymentAccountService,
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) { }
  async execute(token) : Promise<any>  {

    const userFilters = {email:token.email, isActive:true};
    const user = await this.userService.findOneBy(userFilters);

    const upaFilters = {_from: 'Users/' + user._key, isActive: true};
    return await this.paymentaccountService.findAllBy(upaFilters);
  }
}