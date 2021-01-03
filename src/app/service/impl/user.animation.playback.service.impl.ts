import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserAnimationPlayback } from '../../../domain/models/user.animation.playback';
import { UserAnimationPlaybackRepo } from '../../../infra/repository/user.animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderItemUserAnimationPlaybackService } from '../order.item.user.animation.playback.service';
import { UserAnimationPlaybackService } from '../user.animation.playback.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserAnimationPlaybackServiceImpl)
export class UserAnimationPlaybackServiceImpl extends AbstractBaseService<UserAnimationPlayback> implements UserAnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.UserAnimationPlaybackRepoImpl) private userAnimationPlaybackRepo: UserAnimationPlaybackRepo,
    @inject(IOC_TYPE.OrderItemUserAnimationPlaybackServiceImpl) private orderItemUserAnimationPlaybackService: OrderItemUserAnimationPlaybackService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<UserAnimationPlayback[]> {
    return await this.userAnimationPlaybackRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<UserAnimationPlayback[]> {
    return await this.userAnimationPlaybackRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<UserAnimationPlayback> {
    return await this.userAnimationPlaybackRepo.selectOneBy(filters);
  }

  async addOne(model: UserAnimationPlayback): Promise<any> {
    try {
      return await this.userAnimationPlaybackRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(email: string, orderItemKey: string, next: number): Promise<any> {
    try {
      const filters = {_to: 'OrderItem/' + orderItemKey, isActive: true};
      const result = await this.orderItemUserAnimationPlaybackService.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      const uap = await this.findAllByKey(result._from);
      
      // 1. Udpate button isNext
      for (let button of uap[0].buttons) {
        if (button.sequence == next) {
          button.isNext = true;

          // 1.1 Update nextPitStop name
          uap[0].nextPitStop.name = button.tag;
          break;
        } else {
          button.isNext = false;
        }
      }

      uap[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      uap[0].userLastUpdated = email;
      
      return await this.userAnimationPlaybackRepo.update(uap[0]);
    } catch (e) {
      throw e;
    }
  }
}