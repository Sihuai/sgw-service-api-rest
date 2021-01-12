import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Animation } from '../../../domain/models/animation';
import { AnimationRepo } from '../../../infra/repository/animation.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { AnimationService } from '../animation.service';
import { GenericEdgeService } from '../generic.edge.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.AnimationServiceImpl)
export class AnimationServiceImpl extends AbstractBaseService<Animation> implements AnimationService {
  constructor(
    @inject(IOC_TYPE.AnimationRepoImpl) private animationRepo: AnimationRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<Animation[]> {
    return await this.animationRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<Animation[]> {
    return await this.animationRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<Animation> {
    return await this.animationRepo.selectOneBy(filters);
  }

  async addOne(model: Animation): Promise<any> {
    try {
      return await this.animationRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Animation): Promise<any> {
    try {
      return await this.animationRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Animation): Promise<any> {
    try {
      const apResult = await this.animationRepo.selectAllByKey(model._key);
      if (isEmptyObject(apResult) == true) return -10;

      const tapFilters = {_from: 'Animation/' + apResult[0]._key, isActive: true};
      const tapResult = await this.genericEdgeService.findAllBy(tapFilters);
      if (isEmptyObject(tapResult) == false) return -11;
  
      // Remove Animation collection
      apResult[0].isActive = false;
      apResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      apResult[0].userLastUpdated = model.userLastUpdated;

      return await this.animationRepo.update(apResult[0]);
    } catch (e) {
      throw e;
    }
  }
}