import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { TrailDetail } from '../../../domain/models/trail.detail';
import { TrailTrailDetail } from '../../../domain/models/trail.trail.detail';
import { TrailDetailRepo } from '../../../infra/repository/trail.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { TrailDetailService } from '../trail.detail.service';
import { TrailTrailDetailService } from '../trail.trail.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.TrailDetailServiceImpl)
export class TrailDetailServiceImpl extends AbstractBaseService<TrailDetail> implements TrailDetailService {
  constructor(
    @inject(IOC_TYPE.TrailDetailRepoImpl) private trailDetailRepo: TrailDetailRepo,
    @inject(IOC_TYPE.TrailTrailDetailServiceImpl) private trailTrailDetailService: TrailTrailDetailService,
  ) {
    super();
  }

  async findAll() : Promise<TrailDetail[]> {
    return await this.trailDetailRepo.selectAll();
  }

  async findAllBy(filters) : Promise<TrailDetail[]> {
    return await this.trailDetailRepo.selectAllBy(filters);
  }

  async findAllByKey(filters) : Promise<any> {
    return await this.trailDetailRepo.selectAllByKey(filters);
  }

  async findOneBy(filters) : Promise<any> {
    const result = await this.trailTrailDetailService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -11;

    return await this.trailDetailRepo.selectAllByKey(result._to);
  }

  async addOne(trailKey: string, model: TrailDetail): Promise<any> {
    try {
      // 1. Insert into trail detail collection.
      const tdResult = await this.trailDetailRepo.insert(model);
      if (isEmptyObject(tdResult) == true) return -11;

      // 2. insert into trail trail detail edge.
      const ttd = new TrailTrailDetail();
      ttd._from = 'Trail/' + trailKey;
      ttd._to = tdResult._id;
      
      const ttdResult = await this.trailTrailDetailService.addOne(ttd);
      if (isEmptyObject(ttdResult) == true) return -12;

      return tdResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: TrailDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const oldResult = await this.findOneBy(filters);
      if (isEmptyObject(oldResult) == true) return -10;

      return await this.trailDetailRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: TrailDetail): Promise<any> {
    try {
      const tdFilters = {_key: model._key};
      const tdResult = await this.trailDetailRepo.selectOneBy(tdFilters);
      if (isEmptyObject(tdResult) == true) return -10;

      const ttdFilters = {_to: tdResult._id};
      const ttdResult = await this.trailTrailDetailService.removeBy(ttdFilters);
      if (isEmptyObject(ttdResult) == true) return -10;
      if (ttdResult.code != 200) return -10;
      if (ttdResult == -10) return -10;

      return await this.trailDetailRepo.deleteByKey(tdFilters._key);
    } catch (e) {
      throw e;
    }
  }
}