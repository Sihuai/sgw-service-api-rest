import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderPaymentTransaction } from '../../../domain/models/order.payment.transaction';
import { PaymentTransaction } from '../../../domain/models/payment.transaction';
import { PaymentTransactionRepo } from '../../../infra/repository/payment.transaction.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderItemService } from '../order.item.service';
import { OrderPaymentTransactionService } from '../order.payment.transaction.service';
import { OrderService } from '../order.service';
import { PaymentAccountService } from '../payment.account.service';
import { PaymentTransactionService } from '../payment.transaction.service';
import { StripeService } from '../../third.party/stripe.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.PaymentTransactionServiceImpl)
export class PaymentTransactionServiceImpl extends AbstractBaseService<PaymentTransaction> implements PaymentTransactionService {
  constructor(
    @inject(IOC_TYPE.PaymentTransactionRepoImpl) private paymentTransactionRepo: PaymentTransactionRepo,
    @inject(IOC_TYPE.OrderServiceImpl) private orderService: OrderService,
    @inject(IOC_TYPE.OrderItemServiceImpl) private orderItemService: OrderItemService,
    @inject(IOC_TYPE.PaymentAccountServiceImpl) private paymentAccountService: PaymentAccountService,
    @inject(IOC_TYPE.OrderPaymentTransactionServiceImpl) private orderPaymentTransactionService: OrderPaymentTransactionService,
    @inject(IOC_TYPE.StripeServiceImpl) private stripeService: StripeService,
  ) {
    super();
  }

  async addOne(email: string, orderKey: string, paymentAccountKey: string): Promise<any> {
    try {
      // 1.1 Get order information
      const oResults = await this.orderService.findAllByKey(orderKey);
      if (isEmptyObject(oResults) == true) return -11;

      // 1.2 Map order status
      oResults[0].status = 'PAID';
      oResults[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      oResults[0].userLastUpdated = email;

      // 2.1 Get order item information
      const oiResults = await this.orderItemService.findAllBy(orderKey);
      if (isEmptyObject(oiResults) == true) return -12;

      // 2.2 Map order item status
      for (let orderItem of oiResults) {
        orderItem.status = 'PAID';
        orderItem.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        orderItem.userLastUpdated = email;
      }

      // 3. Get PaymentAccount information
      const paResults = await this.paymentAccountService.findAllByKey(paymentAccountKey);
      if (isEmptyObject(paResults) == true) return -13;

      // 4. Pay
      const payResult = await this.stripeService.pay(oResults[0].amount.value, oResults[0].amount.currency, paResults[0].customerID, paResults[0].paymentMethodID);
      if (isEmptyObject(payResult) == true) return -14;

      // 5. Insert into PaymentTransaction collection
      const pt = new PaymentTransaction();
      pt.type = paResults[0].type;
      pt.gateway =  paResults[0].gateway;
      pt.customerID = paResults[0].customerID;
      pt.paymentMethodID = paResults[0].paymentMethodID;
      pt.tag = email;
      pt.data = payResult;
      pt.userCreated = email;
      pt.userLastUpdated = email;

      const ptResult = await this.paymentTransactionRepo.insert(pt);
      if (isEmptyObject(ptResult) == true) return -15;

      // 6. Insert into OrderPaymentTransaction edge
      const opt = new OrderPaymentTransaction();
      opt._from = 'Order/' + oResults[0]._key;
      opt._to = 'PaymentTransaction/' + ptResult._key;
      
      const optResult = await this.orderPaymentTransactionService.addOne(opt);
      if (isEmptyObject(optResult) == true) return -16;

      // 7. Update order status
      const oEditResult = await this.orderService.editOne(oResults[0]);
      if (isEmptyObject(oEditResult) == true) return -17;

      // 8. Update order item status
      for (let orderItem of oiResults) {
        const oiEditResult = await this.orderItemService.editOne(orderItem);
        if (isEmptyObject(oiEditResult) == true) return -19;
      }
      
      return ptResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }
}