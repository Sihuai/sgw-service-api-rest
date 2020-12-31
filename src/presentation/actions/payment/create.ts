import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { PaymentTransactionService } from '../../../app/service/payment.transaction.service';
import { IOC_TYPE } from '../../../config/type';
import { IPaymentDTO } from '../../../domain/dtos/i.payment.dto';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreatePaymentAction, true)
@provide('action', true)
export class CreatePaymentAction implements IAction {
  payloadExample = `  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.PaymentTransactionServiceImpl) private paymentTransactionService: PaymentTransactionService,
  ) {}
  async execute(token, request: IPaymentDTO) : Promise<any> {
    if (isEmptyObject(request.orderkey) == true) return -1;           // Address key is empty!
    if (isEmptyObject(request.paymentaccountkey) == true) return -2;  // Payment Account key is empty!
    
    return await this.paymentTransactionService.addOne(token.email, request.orderkey, request.paymentaccountkey);
  }
}