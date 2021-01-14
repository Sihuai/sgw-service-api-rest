import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { TrailDetail } from '../../../domain/models/trail.detail';
import { TrailDetailRepo } from '../../../infra/repository/trail.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { TrailDetailService } from '../trail.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.TrailDetailServiceImpl)
export class TrailDetailServiceImpl extends AbstractBaseService<TrailDetail> implements TrailDetailService {
  constructor(
    @inject(IOC_TYPE.TrailDetailRepoImpl) private trailDetailRepo: TrailDetailRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAll() : Promise<TrailDetail[]> {
    return await this.trailDetailRepo.selectAll();
  }

  async findAllBy(filters) : Promise<TrailDetail[]> {
    return await this.trailDetailRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<any> {
    return await this.trailDetailRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<TrailDetail> {
    return await this.trailDetailRepo.selectOneBy(filters);
  }

  async addOne(trailKey: string, model: TrailDetail): Promise<any> {
    try {
      // 1. Insert into trail detail collection.
      const tdResult = await this.trailDetailRepo.insert(model);
      if (isEmptyObject(tdResult) == true) return -11;

      // 2. insert into trail trail detail edge.
      const ttd = new GenericEdge();
      ttd._from = 'TrailDetail/' + tdResult._key;
      ttd._to = 'Trail/' + trailKey;
      ttd.userCreated = model.userCreated;
      ttd.userLastUpdated = model.userLastUpdated;
      
      const ttdResult = await this.genericEdgeService.addOne(ttd);
      if (isEmptyObject(ttdResult) == true) return -12;

      return tdResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: TrailDetail): Promise<any> {
    try {
      // 1. Get trail detail
      const tdResult = await this.trailDetailRepo.selectAllByKey(model._key);
      if (isEmptyObject(tdResult) == true) return -10;
      // 2. Get trail trail-detail edge
      const ttdFilters = {_from: 'TrailDetail/' + tdResult[0]._key, isActive: true};
      const ttdResult = await this.genericEdgeService.findOneBy(ttdFilters);

      // 3. Remove trail trail-detail edge
      const ttdDelResult = await this.genericEdgeService.removeBy(model.userLastUpdated, ttdFilters);
      if (ttdDelResult == -10) return -10;
      if (ttdDelResult == false) return -13;

      // 4. Remove trail detail collection
      tdResult[0].isActive = false;
      tdResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      tdResult[0].userLastUpdated = model.userLastUpdated;

      const tdDelResult = await this.trailDetailRepo.update(tdResult[0]);
      if (isEmptyObject(tdDelResult) == true) return -14;

      // 5. Insert into trail detail collection.
      const tdAddResult = await this.trailDetailRepo.insert(model);
      if (isEmptyObject(tdAddResult) == true) return -11;

      // 6. insert into trail trail detail edge.
      const ttd = new GenericEdge();
      ttd._from = 'TrailDetail/' + tdAddResult._key;
      ttd._to = ttdResult._to;
      ttd.userCreated = model.userLastUpdated;
      ttd.userLastUpdated = model.userLastUpdated;

      const ttdAddResult = await this.genericEdgeService.addOne(ttd);
      if (isEmptyObject(ttdAddResult) == true) return -12;

      return tdAddResult;
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: TrailDetail): Promise<any> {
    try {
      const tdResult = await this.trailDetailRepo.selectAllByKey(model._key);
      if (isEmptyObject(tdResult) == true) return -10;

      // 1. Remove trail trail-detail edge
      const ttdFilters = {_from: 'TrailDetail/' + tdResult[0]._key, isActive: true};
      const ttdResult = await this.genericEdgeService.removeBy(model.userLastUpdated, ttdFilters);
      if (ttdResult == -10) return -10;
      if (ttdResult == false) return -13;

      // 2. Remove trail detail collection
      tdResult[0].isActive = false;
      tdResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      tdResult[0].userLastUpdated = model.userLastUpdated;

      return await this.trailDetailRepo.update(tdResult[0]);
    } catch (e) {
      throw e;
    }
  }
}