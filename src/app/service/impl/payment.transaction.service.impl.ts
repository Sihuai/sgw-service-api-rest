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
import { UserAnimation } from '../../../domain/models/user.animation';
import { CartItemOrderItemService } from '../cart.item.order.item.service';
import { CartTrailProductService } from '../cart.trail.product.service';
import { AnimationService } from '../animation.service';
import { UserAnimationService } from '../user.animation.service';
import { OrderItemUserAnimationService } from '../order.item.user.animation.service';
import { OrderItemUserAnimation } from '../../../domain/models/order.item.user.animation';
import { OrderTypes } from '../../../domain/enums/order.types';
import { GenericEdgeService } from '../generic.edge.service';

@provide(IOC_TYPE.PaymentTransactionServiceImpl)
export class PaymentTransactionServiceImpl extends AbstractBaseService<PaymentTransaction> implements PaymentTransactionService {
  constructor(
    @inject(IOC_TYPE.PaymentTransactionRepoImpl) private paymentTransactionRepo: PaymentTransactionRepo,
    @inject(IOC_TYPE.OrderServiceImpl) private orderService: OrderService,
    @inject(IOC_TYPE.OrderItemServiceImpl) private orderItemService: OrderItemService,
    @inject(IOC_TYPE.PaymentAccountServiceImpl) private paymentAccountService: PaymentAccountService,
    @inject(IOC_TYPE.OrderPaymentTransactionServiceImpl) private orderPaymentTransactionService: OrderPaymentTransactionService,
    @inject(IOC_TYPE.StripeServiceImpl) private stripeService: StripeService,
    @inject(IOC_TYPE.CartItemOrderItemServiceImpl) private cartItemOrderItemService: CartItemOrderItemService,
    @inject(IOC_TYPE.CartTrailProductServiceImpl) private cartTrailProductService: CartTrailProductService,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.AnimationServiceImpl) private animationService: AnimationService,
    @inject(IOC_TYPE.UserAnimationServiceImpl) private userAnimationService: UserAnimationService,
    @inject(IOC_TYPE.OrderItemUserAnimationServiceImpl) private orderItemUserAnimationService: OrderItemUserAnimationService,
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
      const userAnimations: Array<UserAnimation> = [];
      for (let orderItem of oiResults) {
        orderItem.status = 'PAID';
        orderItem.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        orderItem.userLastUpdated = email;

        switch(orderItem.type)
        {
          case OrderTypes.PRODUCT:
            break;
          case OrderTypes.TRAIL:
            // 2.2.1 Map user animation playback
            var filters = {_to: 'OrderItem/' + orderItem._key, isActive:true};
            const cioi = await this.cartItemOrderItemService.findOneBy(filters);

            filters = {_to: cioi._from, isActive:false}; // CartItem key (isActive is false, mean is after create order, update the cart isActive to false)
            const ctp = await this.cartTrailProductService.findOneBy(filters);
 
            filters = {_to: ctp._from, isActive:true};  // TrailDetail key
            const ttd = await this.genericEdgeService.findOneBy(filters);

            filters = {_to: ttd._from, isActive:true};  // Trail key
            const tap = await this.genericEdgeService.findOneBy(filters);

            const ap = await this.animationService.findAllByKey(tap._from); // Animation key

            const userAnimation = new UserAnimation();
            userAnimation.type = ap[0].type;
            userAnimation.orientation = ap[0].orientation;
            userAnimation.nextPitStop = ap[0].nextPitStop;
            userAnimation.buttons = ap[0].buttons;
            userAnimation.icons = ap[0].icons;
            userAnimation.userCreated = email;
            userAnimation.userLastUpdated = email;
            userAnimation._key = orderItem._key; // Note: This is temp key value only provide for OrderItemUserAnimationService edge map.

            userAnimations.push(userAnimation);
            break;
        }
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
      opt.userCreated = email;
      opt.userLastUpdated = email;
      
      const optResult = await this.orderPaymentTransactionService.addOne(opt);
      if (isEmptyObject(optResult) == true) return -16;

      // 7. Update order status
      const oEditResult = await this.orderService.editOne(oResults[0]);
      if (isEmptyObject(oEditResult) == true) return -17;

      // 8. Update order item status
      for (let orderItem of oiResults) {
        const oiEditResult = await this.orderItemService.editOne(orderItem);
        if (isEmptyObject(oiEditResult) == true) return -18;
      }

      // 9. Insert into UserAnimation collection & UserUserAnimationService edge
      for (let userAnimation of userAnimations) {
        const uapResult = await this.userAnimationService.addOne(userAnimation);
        if (isEmptyObject(uapResult) == true) return -19;

        const oiuap = new OrderItemUserAnimation();
        oiuap._from = 'UserAnimation/' + uapResult._key;
        oiuap._to = 'OrderItem/' + userAnimation._key;
        oiuap.userCreated = email;
        oiuap.userLastUpdated = email;

        const oiuapResult = await this.orderItemUserAnimationService.addOne(oiuap);
        if (isEmptyObject(oiuapResult) == true) return -20;
      }
      
      return ptResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }
}