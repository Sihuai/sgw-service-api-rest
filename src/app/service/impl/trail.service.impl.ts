import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Trail } from '../../../domain/models/trail';
import { TrailRepo } from '../../../infra/repository/trail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { PageResult } from '../../../infra/utils/oct-orm/types/pageResult';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { TrailService } from '../trail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.TrailServiceImpl)
export class TrailServiceImpl extends AbstractBaseService<Trail> implements TrailService {
  constructor(
    @inject(IOC_TYPE.TrailRepoImpl) private trailRepo: TrailRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAll() : Promise<Trail[]> {
    return await this.trailRepo.selectAll();
  }

  async page(filters) : Promise<any> {
    return await this.trailRepo.page(filters);
  }

  async findAllBy(filters) : Promise<Trail> {
    return await this.trailRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<any> {
    return await this.trailRepo.selectAllByKey(key);
  }

  async pageByKey(key) : Promise<PageResult> {
    return await this.trailRepo.pageByKey(key);
  }

  async findOneBy(filters) : Promise<Trail> {
    return await this.trailRepo.selectOneBy(filters);
  }

  async addOne(model: Trail): Promise<any> {
    try {
      return await this.trailRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Trail): Promise<any> {
    try {
      const oldResult = await this.trailRepo.selectAllByKey(model._key);
      if (isEmptyObject(oldResult) == true) return -10;

      return await this.trailRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Trail): Promise<any> {
    try {
      const result = await this.trailRepo.selectAllByKey(model._key);
      if (isEmptyObject(result[0]) == true) return -10;

      // 1. Check Trail Trail-Detail relation edge have record or not
      const filters = {_to: 'Trail/' + result[0]._key, isActive: true};
      const ttdResult = await this.genericEdgeService.findAllBy(filters);
      if (isEmptyObject(ttdResult) == false) return -11;
      
      // 2. Remove trail collection
      result[0].isActive = false;
      result[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.trailRepo.update(result[0]);
    } catch (e) {
      throw e;
    }
  }
}