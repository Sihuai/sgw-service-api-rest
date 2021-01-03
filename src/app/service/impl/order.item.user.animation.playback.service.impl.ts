import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderItemUserAnimationPlayback } from '../../../domain/models/order.item.user.animation.playback';
import { OrderItemUserAnimationPlaybackRepo } from '../../../infra/repository/order.item.user.animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderItemUserAnimationPlaybackService } from '../order.item.user.animation.playback.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderItemUserAnimationPlaybackServiceImpl)
export class OrderItemUserAnimationPlaybackServiceImpl extends AbstractBaseService<OrderItemUserAnimationPlayback> implements OrderItemUserAnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.OrderItemUserAnimationPlaybackRepoImpl) private orderItemUserAnimationPlaybackRepo: OrderItemUserAnimationPlaybackRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<OrderItemUserAnimationPlayback[]> {
    return await this.orderItemUserAnimationPlaybackRepo.selectAllBy(filters);
  }

  async page(filters) : Promise<any> {
    return await this.orderItemUserAnimationPlaybackRepo.page(filters);
  }

  async findOneBy(filters) : Promise<OrderItemUserAnimationPlayback> {
    return await this.orderItemUserAnimationPlaybackRepo.selectOneBy(filters);
  }

  async addOne(model: OrderItemUserAnimationPlayback): Promise<any> {
    try {
      return await this.orderItemUserAnimationPlaybackRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: OrderItemUserAnimationPlayback): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.orderItemUserAnimationPlaybackRepo.deleteByKey(result._key);
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

        const updateResult = await this.orderItemUserAnimationPlaybackRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
      // const keys: Array<string> = [];
      // for (let data of result) {
      //   keys.push(data._key);
      // }

      // return await this.orderItemUserAnimationPlaybackRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}