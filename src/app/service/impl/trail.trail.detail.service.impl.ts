import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { TrailTrailDetail } from '../../../domain/models/trail.trail.detail';
import { TrailTrailDetailRepo } from '../../../infra/repository/trail.trail.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { TrailTrailDetailService } from '../trail.trail.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.TrailTrailDetailServiceImpl)
export class TrailTrailDetailServiceImpl extends AbstractBaseService<TrailTrailDetail> implements TrailTrailDetailService {
  constructor(
    @inject(IOC_TYPE.TrailTrailDetailRepoImpl) private trailTrailDetailRepo: TrailTrailDetailRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<TrailTrailDetail[]> {
    return await this.trailTrailDetailRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<TrailTrailDetail> {
    return await this.trailTrailDetailRepo.selectOneBy(filters);
  }

  async addOne(model: TrailTrailDetail): Promise<any> {
    try {
      return await this.trailTrailDetailRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: TrailTrailDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.trailTrailDetailRepo.deleteByKey(result._key);
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

      return await this.trailTrailDetailRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}