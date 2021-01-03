import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { AnimationPlayback } from '../../../domain/models/animation.playback';
import { AnimationPlaybackRepo } from '../../../infra/repository/animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { AnimationPlaybackService } from '../animation.playback.service';
import { TrailAnimationPlaybackService } from '../trail.animation.playback.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.AnimationPlaybackServiceImpl)
export class AnimationPlaybackServiceImpl extends AbstractBaseService<AnimationPlayback> implements AnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.AnimationPlaybackRepoImpl) private animationPlaybackRepo: AnimationPlaybackRepo,
    @inject(IOC_TYPE.TrailAnimationPlaybackServiceImpl) private trailAnimationPlaybackService: TrailAnimationPlaybackService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<AnimationPlayback[]> {
    return await this.animationPlaybackRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<AnimationPlayback[]> {
    return await this.animationPlaybackRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<AnimationPlayback> {
    return await this.animationPlaybackRepo.selectOneBy(filters);
  }

  async addOne(model: AnimationPlayback): Promise<any> {
    try {
      return await this.animationPlaybackRepo.insert(model);
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
      const apResult = await this.animationPlaybackRepo.selectAllByKey(model._key);
      if (isEmptyObject(apResult) == true) return -10;

      const tapFilters = {_from: 'AnimationPlayback/' + apResult[0]._key, isActive: true};
      const tapResult = await this.trailAnimationPlaybackService.findAllBy(tapFilters);
      if (isEmptyObject(tapResult) == false) return -11;
  
      // Remove AnimationPlayback collection
      apResult[0].isActive = false;
      apResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      apResult[0].userLastUpdated = model.userLastUpdated;

      return await this.animationPlaybackRepo.update(apResult[0]);
    } catch (e) {
      throw e;
    }
  }
}