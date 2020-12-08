import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { SectionTrail } from '../../../domain/models/section.trail';
import { SectionTrailRepo } from '../../../infra/repository/section.trail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { SectionTrailService } from '../section.trail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.SectionTrailServiceImpl)
export class SectionTrailServiceImpl extends AbstractBaseService<SectionTrail> implements SectionTrailService {
  constructor(
    @inject(IOC_TYPE.SectionTrailRepoImpl) private sectionTrailRepo: SectionTrailRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<SectionTrail[]> {
    return await this.sectionTrailRepo.selectAllBy(filters);
  }

  async page(filters) : Promise<any> {
    return await this.sectionTrailRepo.page(filters);
  }

  async findOne(filters) : Promise<SectionTrail> {
    return await this.sectionTrailRepo.selectOneBy(filters);
  }

  async addOne(model: SectionTrail): Promise<any> {
    try {
      return await this.sectionTrailRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: SectionTrail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOne(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.sectionTrailRepo.deleteByKey(result._key);
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

      return await this.sectionTrailRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}