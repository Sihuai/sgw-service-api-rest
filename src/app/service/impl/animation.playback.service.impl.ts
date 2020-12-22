import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { AnimationPlayback } from '../../../domain/models/animation.playback';
import { AnimationPlaybackRepo } from '../../../infra/repository/animation.playback.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { AnimationPlaybackService } from '../animation.playback.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.AnimationPlaybackServiceImpl)
export class AnimationPlaybackServiceImpl extends AbstractBaseService<AnimationPlayback> implements AnimationPlaybackService {
  constructor(
    @inject(IOC_TYPE.AnimationPlaybackRepoImpl) private animationPlaybackRepo: AnimationPlaybackRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<AnimationPlayback[]> {
    return await this.animationPlaybackRepo.selectAllBy(filters);
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

  async removeOne(model: AnimationPlayback): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.animationPlaybackRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }

  async removeBy(filters): Promise<any> {
    try {
      const result = await this.findAllBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      const keys: Array<string> = [];
      for (let data of result) {
        keys.push(data._key);
      }

      return await this.animationPlaybackRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}