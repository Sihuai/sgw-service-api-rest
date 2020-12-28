import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderItem } from '../../../domain/models/order.item';
import { OrderItemRepo } from '../../../infra/repository/order.item.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderItemService } from '../order.item.service';
import { OrderOrderItemService } from '../order.order.item.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderItemServiceImpl)
export class OrderItemServiceImpl extends AbstractBaseService<OrderItem> implements OrderItemService {
  constructor(
    @inject(IOC_TYPE.OrderItemRepoImpl) private orderItemRepo: OrderItemRepo,
    @inject(IOC_TYPE.OrderOrderItemServiceImpl) private orderOrderItemService: OrderOrderItemService,
  ) {
    super();
  }

  async findAll() : Promise<OrderItem[]> {
    return await this.orderItemRepo.selectAll();
  }

  async findAllBy(orderKey: string) : Promise<OrderItem[]> {
    // 1. Get Order & OrderItem edge
    const ooiFilters = {_from: 'Order/' + orderKey, isActive: true};
    const ooiResult = await this.orderOrderItemService.findAllBy(ooiFilters);

    const oiKeys: Array<string> = [];
    for (let ooi of ooiResult) {
      oiKeys.push(ooi._to);
    }

    // 2. Get OrderItem
    return await this.orderItemRepo.selectAllByKey(oiKeys);
  }

  async findAllByKey(filters) : Promise<OrderItem[]> {
    return await this.orderItemRepo.selectAllByKey(filters);
  }

  async findOneBy(filters) : Promise<OrderItem> {
    return await this.orderItemRepo.selectOneBy(filters);
  }

  async countBy(filters) : Promise<any> {
    const result = await this.orderItemRepo.countBy(filters);
    if (result == null) return 0;
    return result;
  }

  async addOne(orderItem: OrderItem): Promise<any> {
    try {
      const result = await this.orderItemRepo.insert(orderItem);
      if (isEmptyObject(result) == true) return -11;

      return result;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: OrderItem): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.orderItemRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.orderItemRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: OrderItem): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      // 1. Remove Order OrderItem edge
      const ctpFilters = {_to: 'OrderItem/' + model._key, isActive: true};
      const ctpResult = await this.orderOrderItemService.removeBy(model.userLastUpdated, ctpFilters);
      if (ctpResult == -10) return -10;
      if (ctpResult == false) return -13;

      // 2. Remove OrderItem
      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.orderItemRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}