import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Section } from '../../../domain/models/section';
import { SectionRepo } from '../../../infra/repository/section.repo';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { SectionService } from '../section.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.SectionServiceImpl)
export class SectionServiceImpl extends AbstractBaseService<Section> implements SectionService {
  constructor(
    @inject(IOC_TYPE.SectionRepoImpl) private sectionRepo: SectionRepo,
  ) {
    super();
  }

  async findAll() : Promise<Section[]> {
    return await this.sectionRepo.selectAll();
  }

  async findAllBy(filters) : Promise<Section> {
    return await this.sectionRepo.selectAllBy(filters);
  }

  async findOne(filters) : Promise<Section> {
    return await this.sectionRepo.selectOneBy(filters);
  }

  async addOne(model: Section): Promise<any> {
    try {
      return await this.sectionRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Section): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.sectionRepo.existsBy(filters);
      if (isExisted == false) return -11;

      const result = this.removeOne(model);

      return await this.addOne(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Section): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOne(filters);
      if (result == null) return -10;
  
      return await this.sectionRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}