import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderItemUserAnimation } from '../../../domain/models/order.item.user.animation';
import { OrderItemUserAnimationRepo } from '../../../infra/repository/order.item.user.animation.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderItemUserAnimationService } from '../order.item.user.animation.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderItemUserAnimationServiceImpl)
export class OrderItemUserAnimationServiceImpl extends AbstractBaseService<OrderItemUserAnimation> implements OrderItemUserAnimationService {
  constructor(
    @inject(IOC_TYPE.OrderItemUserAnimationRepoImpl) private orderItemUserAnimationRepo: OrderItemUserAnimationRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<OrderItemUserAnimation[]> {
    return await this.orderItemUserAnimationRepo.selectAllBy(filters);
  }

  async page(filters) : Promise<any> {
    return await this.orderItemUserAnimationRepo.page(filters);
  }

  async findOneBy(filters) : Promise<OrderItemUserAnimation> {
    return await this.orderItemUserAnimationRepo.selectOneBy(filters);
  }

  async addOne(model: OrderItemUserAnimation): Promise<any> {
    try {
      return await this.orderItemUserAnimationRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: OrderItemUserAnimation): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.orderItemUserAnimationRepo.deleteByKey(result._key);
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

        const updateResult = await this.orderItemUserAnimationRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
      // const keys: Array<string> = [];
      // for (let data of result) {
      //   keys.push(data._key);
      // }

      // return await this.orderItemUserAnimationRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}