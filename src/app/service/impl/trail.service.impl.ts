import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Trail } from '../../../domain/models/trail';
import { TrailRepo } from '../../../infra/repository/trail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { PageResult } from '../../../infra/utils/oct-orm/types/pageResult';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { TrailService } from '../trail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.TrailServiceImpl)
export class TrailServiceImpl extends AbstractBaseService<Trail> implements TrailService {
  constructor(
    @inject(IOC_TYPE.TrailRepoImpl) private trailRepo: TrailRepo,
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

  async findAllByKey(filters) : Promise<any> {
    return await this.trailRepo.selectAllByKey(filters);
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
      const filters = {_key: model._key};
      const oldResult = await this.findOneBy(filters);
      if (isEmptyObject(oldResult) == true) return -10;

      return await this.trailRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Trail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.trailRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}