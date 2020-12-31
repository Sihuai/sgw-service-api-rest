import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import Stripe from 'stripe';
import { AbstractBaseService } from '../../service/impl/base.service.impl';
import { IPaymentAccountDTO } from '../../../domain/dtos/i.payment.account.dto';
import { UserService } from '../../service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { StripeService } from '../stripe.service';
import { logPaymentTrade } from '../../../infra/utils/logger';

@provide(IOC_TYPE.StripeServiceImpl)
export class StripeServiceImpl extends AbstractBaseService<Stripe> implements StripeService {
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) {
    super();
  }

  newStripe(): Stripe {
    // instantiate a copy of Stripe
    const secret = (typeof(process.env.STRIPE_SECRET) === 'undefined')? '': process.env.STRIPE_SECRET;
    const stripe = new Stripe(secret, {apiVersion:'2020-08-27'})
    return stripe;
  }

  async findAllByKey(key) : Promise<any> {
    const stripe = this.newStripe();

    const promises : Array<any> = [];
    key.forEach((key) => {
        promises.push(stripe.paymentMethods.list({customer: key, type: 'card'}));
    })

    return await Promise.all(promises);
  }

  async attach(user, customerID, dto: IPaymentAccountDTO): Promise<any> {
    try{
      // assuming that user do not have an associated stripe customer id create a stripe customer object
      const metadata = {
        sgw_id: 'Users/' + user._key,
        sgw_key: user._key
      };
      
      const stripe = this.newStripe();
      // create a card
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: dto.number,
          cvc: dto.cvc,
          exp_month: dto.expMonth,
          exp_year: dto.expYear
        },
        metadata
      });

      if(typeof(customerID) === 'undefined' || typeof(customerID) !== 'string' || (typeof(customerID) === 'string' && customerID.trim().length === 0)){
        const name = `${user.nameFirst} ${user.nameLast}`;
        // no customerID passed in or unappropriate customerID passed in.
        const customer = await stripe.customers.create({metadata, name});
        // attach the created card to a specific stripe customer (i.e. User) add payment method to sgw database
        return await stripe.paymentMethods.attach(paymentMethod.id, {customer: customer.id});
      }

      return await stripe.paymentMethods.attach(paymentMethod.id, {customer: customerID}); // customerID is passed in
    }catch(e){
      throw e;
    }
  }

  async detach(paymentMethodID: string): Promise<any> {
    try {
      const stripe = this.newStripe();
      return await stripe.paymentMethods.detach(paymentMethodID);
    } catch (e) {
      throw e;
    }
  }

  async deleteOne(customerID: string): Promise<boolean> {
    try {
      const stripe = this.newStripe();
      const stripeResult = await stripe.customers.del(customerID);

      return stripeResult.deleted;
    } catch (e) {
      throw e;
    }
  }

  async pay(total: number, currency: string, customerID: string, paymentMethodID: string): Promise<any> {
    try{
      const stripe = this.newStripe();
  
      const intent = await stripe.paymentIntents.create({
          amount: total*100,
          currency: currency,
          payment_method_types: ['card'],
          customer: customerID,
      })
      
      const outcomeConfirmation = await stripe.paymentIntents.confirm(
          intent.id,
          {
              payment_method: paymentMethodID
          }
      )

      var result = JSON.stringify(outcomeConfirmation);
      
      // Save log file to local disk for backup
      logPaymentTrade(result);

      return result;
    }catch(e){
      throw e;
    }
  }
}