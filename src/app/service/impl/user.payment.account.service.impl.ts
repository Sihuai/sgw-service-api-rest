import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserPaymentAccount } from '../../../domain/models/user.payment.account';
import { UserPaymentAccountRepo } from '../../../infra/repository/user.payment.account.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { UserPaymentAccountService } from '../user.payment.account.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserPaymentAccountServiceImpl)
export class UserPaymentAccountServiceImpl extends AbstractBaseService<UserPaymentAccount> implements UserPaymentAccountService {
  constructor(
    @inject(IOC_TYPE.UserPaymentAccountRepoImpl) private userPaymentAccountRepo: UserPaymentAccountRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<UserPaymentAccount[]> {
    return await this.userPaymentAccountRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<UserPaymentAccount> {
    return await this.userPaymentAccountRepo.selectOneBy(filters);
  }

  async addOne(model: UserPaymentAccount): Promise<any> {
    try {
      return await this.userPaymentAccountRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: UserPaymentAccount): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.userPaymentAccountRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }

  async removeBy(user: string, filters): Promise<any> {
    try {
      const result = await this.findAllBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      for (let data of result) {
        data.isActive = false;
        data.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        data.userLastUpdated = user;

        const updateResult = await this.userPaymentAccountRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}