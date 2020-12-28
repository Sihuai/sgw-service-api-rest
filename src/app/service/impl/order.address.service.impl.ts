import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderAddress } from '../../../domain/models/order.address';
import { OrderAddressRepo } from '../../../infra/repository/order.address.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderAddressService } from '../order.address.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderAddressServiceImpl)
export class OrderAddressServiceImpl extends AbstractBaseService<OrderAddress> implements OrderAddressService {
  constructor(
    @inject(IOC_TYPE.OrderAddressRepoImpl) private orderAddressRepo: OrderAddressRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<OrderAddress[]> {
    return await this.orderAddressRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<OrderAddress> {
    return await this.orderAddressRepo.selectOneBy(filters);
  }

  async addOne(model: OrderAddress): Promise<any> {
    try {
      return await this.orderAddressRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: OrderAddress): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.orderAddressRepo.deleteByKey(result._key);
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

        const updateResult = await this.orderAddressRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}