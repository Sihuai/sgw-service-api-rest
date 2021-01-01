import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { TrailAnimationPlayback } from '../../../domain/models/trail.animation.playback';
import { TrailAnimationPlaybackRepo } from '../../../infra/repository/trail.animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { TrailAnimationPlaybackService } from '../trail.animation.playback.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.TrailAnimationPlaybackServiceImpl)
export class TrailAnimationPlaybackServiceImpl extends AbstractBaseService<TrailAnimationPlayback> implements TrailAnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.TrailAnimationPlaybackRepoImpl) private trailAnimationPlaybackRepo: TrailAnimationPlaybackRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<TrailAnimationPlayback[]> {
    return await this.trailAnimationPlaybackRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<TrailAnimationPlayback> {
    return await this.trailAnimationPlaybackRepo.selectOneBy(filters);
  }

  async addOne(model: TrailAnimationPlayback): Promise<any> {
    try {
      return await this.trailAnimationPlaybackRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: TrailAnimationPlayback): Promise<any> {
    try {
      const filters = {_from: model._from, _to:  model._to};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.trailAnimationPlaybackRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}