import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { AnimationPlayback } from '../../../domain/models/animation.playback';
import { UserAnimationPlayback } from '../../../domain/models/user.animation.playback';
import { AnimationPlaybackRepo } from '../../../infra/repository/animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { AnimationPlaybackService } from '../animation.playback.service';
import { UserAnimationPlaybackService } from '../user.animation.playback.service';
import { UserService } from '../user.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.AnimationPlaybackServiceImpl)
export class AnimationPlaybackServiceImpl extends AbstractBaseService<AnimationPlayback> implements AnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.AnimationPlaybackRepoImpl) private animationPlaybackRepo: AnimationPlaybackRepo,
    @inject(IOC_TYPE.UserAnimationPlaybackServiceImpl) private userAnimationPlaybackService: UserAnimationPlaybackService,
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<any> {
    const uaps = await this.userAnimationPlaybackService.findAllBy(filters);
    if (isEmptyObject(uaps) == true) return -10;

    const keys: Array<string> = [];
    for (let uap of uaps) {
      keys.push(uap._to);
    }

    return await this.animationPlaybackRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<AnimationPlayback> {
    return await this.animationPlaybackRepo.selectOneBy(filters);
  }

  async addOne(model: AnimationPlayback): Promise<any> {
    try {
      const userFilters = {email:model.userCreated, isActive:true};
      const user = await this.userService.findOneBy(userFilters);
      
      // 1. Insert into AnimationPlayback
      const result = await this.animationPlaybackRepo.insert(model);
      // 2. Insert into UserAnimationPlayback
      const uap = new UserAnimationPlayback();
      uap._from = 'Users/' + user._key;
      uap._to = 'AnimationPlayback/' + result._key;
      const uaResult = await this.userAnimationPlaybackService.addOne(uap);
      if (isEmptyObject(uaResult) == true) result -12;

      return result;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: AnimationPlayback): Promise<any> {
    try {
      return await this.animationPlaybackRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: AnimationPlayback): Promise<any> {
    try {
      const result = await this.animationPlaybackRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;
  
      // // 1. Remove user AnimationPlayback relation collection
      // const uaFilters = {_to: 'AnimationPlayback/' + result[0]._key, isActive:true};
      // const uaResult = await this.userAnimationPlaybackService.removeBy(model.userLastUpdated, uaFilters);
      // if (uaResult == -10) return -10;
      // if (uaResult == false) return -13;
      
      // 2. Remove AnimationPlayback collection
      result[0].isActive = false;
      result[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.editOne(result[0]);
    } catch (e) {
      throw e;
    }
  }
}