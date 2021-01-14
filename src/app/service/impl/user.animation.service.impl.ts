import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserAnimation } from '../../../domain/models/user.animation';
import { UserAnimationRepo } from '../../../infra/repository/user.animation.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OrderItemUserAnimationService } from '../order.item.user.animation.service';
import { UserAnimationService } from '../user.animation.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserAnimationServiceImpl)
export class UserAnimationServiceImpl extends AbstractBaseService<UserAnimation> implements UserAnimationService {
  constructor(
    @inject(IOC_TYPE.UserAnimationRepoImpl) private userAnimationRepo: UserAnimationRepo,
    @inject(IOC_TYPE.OrderItemUserAnimationServiceImpl) private orderItemUserAnimationService: OrderItemUserAnimationService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<UserAnimation[]> {
    return await this.userAnimationRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<UserAnimation[]> {
    return await this.userAnimationRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<UserAnimation> {
    return await this.userAnimationRepo.selectOneBy(filters);
  }

  async addOne(model: UserAnimation): Promise<any> {
    try {
      return await this.userAnimationRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(email: string, orderItemKey: string, next: number): Promise<any> {
    try {
      const filters = {_to: 'OrderItem/' + orderItemKey, isActive: true};
      const result = await this.orderItemUserAnimationService.findOneBy(filters);
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
      
      return await this.userAnimationRepo.update(uap[0]);
    } catch (e) {
      throw e;
    }
  }
}