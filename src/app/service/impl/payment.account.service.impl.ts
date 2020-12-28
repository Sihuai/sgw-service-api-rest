import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { IPaymentAccountDTO } from '../../../domain/dtos/i.payment.account.dto';
import { PaymentAccount } from '../../../domain/models/payment.account';
import { UserPaymentAccount } from '../../../domain/models/user.payment.account';
import { PaymentAccountRepo } from '../../../infra/repository/payment.account.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { PaymentAccountService } from '../payment.account.service';
import { StripeService } from '../third.party/stripe.service';
import { UserPaymentAccountService } from '../user.payment.account.service';
import { UserService } from '../user.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.PaymentAccountServiceImpl)
export class PaymentAccountServiceImpl extends AbstractBaseService<PaymentAccount> implements PaymentAccountService {
  constructor(
    @inject(IOC_TYPE.PaymentAccountRepoImpl) private paymentaccountRepo: PaymentAccountRepo,
    @inject(IOC_TYPE.UserPaymentAccountServiceImpl) private userPaymentAccountService: UserPaymentAccountService,
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
    @inject(IOC_TYPE.StripeServiceImpl) private stripeService: StripeService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<any> {
    const userPaymentAccountes = await this.userPaymentAccountService.findAllBy(filters);
    if (isEmptyObject(userPaymentAccountes) == true) return -10;

    const keys: Array<string> = [];
    for (let userPaymentAccount of userPaymentAccountes) {
      keys.push(userPaymentAccount._to);
    }

    return await this.paymentaccountRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<PaymentAccount> {
    return await this.paymentaccountRepo.selectOneBy(filters);
  }

  async addOne(email: string, dto: IPaymentAccountDTO): Promise<any> {
    try {
      const userFilters = {email:email, isActive:true};
      const user = await this.userService.findOneBy(userFilters);

      // 1. Check payment account in PaymentAccount collection
      const upaFilters = {_from: 'Users/' + user._key, isActive:true};
      const paymentAccountes = await this.userPaymentAccountService.findAllBy(upaFilters);

      // 2.1 If have account, then, get the account details
      if (isEmptyObject(paymentAccountes) == false && paymentAccountes != -10) {
        const customerIDs: Array<string> = [];
        for (let paymentAccount of paymentAccountes) {
          customerIDs.push(paymentAccount.customerID);
        }

        // 2.2. Check account number existed or not
        const cards = await this.stripeService.findAllByKey(customerIDs);
        for (let card of cards) {
          if (card.number == dto.number) return -10;
        }
      }

      // 3. Create new account 
      const account = await this.stripeService.attach(user, '', dto);
      if (isEmptyObject(account) == true) return -11;
      
      // 4. Insert into paymentaccount
      const model = new PaymentAccount();
      model.type = account.type;
      model.gateway = account.gateway;
      model.customerID = account.customerID;
      model.paymentMethodID = account.paymentMethodID;
      model.tag = email;
      model.userCreated = email;
      model.userLastUpdated = email;

      const result = await this.paymentaccountRepo.insert(model);
      if (isEmptyObject(result) == true) return -12;

      // 5. Insert into UserPaymentAccount
      const userPaymentAccount = new UserPaymentAccount();
      userPaymentAccount._from = 'Users/' + user._key;
      userPaymentAccount._to = 'PaymentAccount/' + result._key;
      
      const upaResult = await this.userPaymentAccountService.addOne(userPaymentAccount);
      if (isEmptyObject(upaResult) == true) return -13;

      return result;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: PaymentAccount): Promise<any> {
    try {
      const result = await this.paymentaccountRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      // 1. Detach in stripe
      const stripeResult = await this.stripeService.detach(result[0].paymentMethodID);
      if (isEmptyObject(stripeResult) == true) return -11;
  
      // 2. Remove user paymentaccount relation edge
      const upaFilters = {_to: 'PaymentAccount/' + result[0]._key, isActive:true};
      const upaResult = await this.userPaymentAccountService.removeBy(model.userLastUpdated, upaFilters);
      if (upaResult == -10) return -12;
      if (upaResult == false) return -13;
      
      // 3. Remove paymentaccount collection
      result[0].isActive = false;
      result[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.paymentaccountRepo.update(result[0]);
    } catch (e) {
      throw e;
    }
  }

  async deleteOne(model: PaymentAccount): Promise<any> {
    try {
      const result = await this.paymentaccountRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      return await this.stripeService.deleteOne(result[0].customerID);
    } catch (e) {
      throw e;
    }
  }
}