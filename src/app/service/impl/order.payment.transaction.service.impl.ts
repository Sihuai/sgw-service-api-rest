import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderPaymentTransaction } from '../../../domain/models/order.payment.transaction';
import { OrderPaymentTransactionRepo } from '../../../infra/repository/order.payment.transaction.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderPaymentTransactionService } from '../order.payment.transaction.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderPaymentTransactionServiceImpl)
export class OrderPaymentTransactionServiceImpl extends AbstractBaseService<OrderPaymentTransaction> implements OrderPaymentTransactionService {
  constructor(
    @inject(IOC_TYPE.OrderPaymentTransactionRepoImpl) private orderPaymentTransactionRepo: OrderPaymentTransactionRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<OrderPaymentTransaction[]> {
    return await this.orderPaymentTransactionRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<OrderPaymentTransaction> {
    return await this.orderPaymentTransactionRepo.selectOneBy(filters);
  }

  async addOne(model: OrderPaymentTransaction): Promise<any> {
    try {
      return await this.orderPaymentTransactionRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: OrderPaymentTransaction): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.orderPaymentTransactionRepo.deleteByKey(result._key);
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

        const updateResult = await this.orderPaymentTransactionRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}