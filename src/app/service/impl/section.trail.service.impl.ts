import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
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

  async page(filters, pageIndex: number, pageSize: number) : Promise<any> {
    return await this.sectionTrailRepo.page(filters, pageIndex, pageSize);
  }

  async findOneBy(filters) : Promise<SectionTrail> {
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
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;
  
      return await this.sectionTrailRepo.update(result);
    } catch (e) {
      throw e;
    }
  }

  async removeBy(user: string, filters): Promise<any> {
    try {
      const result = await this.findAllBy(filters);
      if (isEmptyObject(result) == true) return -10;

      for (let data of result) {
        data.isActive = false;
        data.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        data.userLastUpdated = user;

        const updateResult = await this.sectionTrailRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }
  
      return true;
    } catch (e) {
      throw e;
    }
  }
}