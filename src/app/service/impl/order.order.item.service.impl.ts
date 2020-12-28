import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderOrderItem } from '../../../domain/models/order.order.item';
import { OrderOrderItemRepo } from '../../../infra/repository/order.order.item.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderOrderItemService } from '../order.order.item.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderOrderItemServiceImpl)
export class OrderOrderItemServiceImpl extends AbstractBaseService<OrderOrderItem> implements OrderOrderItemService {
  constructor(
    @inject(IOC_TYPE.OrderOrderItemRepoImpl) private orderOrderItemRepo: OrderOrderItemRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<OrderOrderItem[]> {
    return await this.orderOrderItemRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<OrderOrderItem> {
    return await this.orderOrderItemRepo.selectOneBy(filters);
  }

  async addOne(model: OrderOrderItem): Promise<any> {
    try {
      return await this.orderOrderItemRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: OrderOrderItem): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.orderOrderItemRepo.deleteByKey(result._key);
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

        const updateResult = await this.orderOrderItemRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}