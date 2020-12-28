import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { PaymentAccountService } from '../../../app/service/payment.account.service';
import { IOC_TYPE } from '../../../config/type';
import { IPaymentAccountDTO } from '../../../domain/dtos/i.payment.account.dto';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreatePaymentAccountAction, true)
@provide('action', true)
export class CreatePaymentAccountAction implements IAction {
  payloadExample = `
  {
    "number": "5555555555554444",
    "cvc": "0123",
    "expMonth": "12",
    "expYear": "2025",
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.PaymentAccountServiceImpl) private paymentaccountService: PaymentAccountService,
  ) {}
  async execute(token, request: IPaymentAccountDTO) : Promise<any> {

    if (isEmptyObject(request.number) == true) return -1; // Card number is empty!
    if (isEmptyObject(request.cvc) == true) return -2; // Card CVC is empty!
    if (request.expMonth <= 0 || request.expMonth > 12) return -3; // Card expire Month is incorrect!
    if (request.expYear < 2000) return -4; // Card expire Year is incorrect!
    
    return await this.paymentaccountService.addOne(token.email, request);
  }
}