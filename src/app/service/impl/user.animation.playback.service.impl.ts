import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserAnimationPlayback } from '../../../domain/models/user.animation.playback';
import { UserAnimationPlaybackRepo } from '../../../infra/repository/user.animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { UserAnimationPlaybackService } from '../user.animation.playback.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserAnimationPlaybackServiceImpl)
export class UserAnimationPlaybackServiceImpl extends AbstractBaseService<UserAnimationPlayback> implements UserAnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.UserAnimationPlaybackRepoImpl) private userAnimationPlaybackRepo: UserAnimationPlaybackRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<UserAnimationPlayback[]> {
    return await this.userAnimationPlaybackRepo.selectAllBy(filters);
  }

  async page(filters) : Promise<any> {
    return await this.userAnimationPlaybackRepo.page(filters);
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

  async removeOne(model: UserAnimationPlayback): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.userAnimationPlaybackRepo.deleteByKey(result._key);
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

        const updateResult = await this.userAnimationPlaybackRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
      // const keys: Array<string> = [];
      // for (let data of result) {
      //   keys.push(data._key);
      // }

      // return await this.userAnimationPlaybackRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}