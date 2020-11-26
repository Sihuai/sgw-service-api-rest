import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Section } from '../../../domain/models/section';
import { SectionRepo } from '../../../infra/repository/section.repo';
import { AppErrorUnexpected } from '../../errors/unexpected';
import { SectionService } from '../section.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.SectionServiceImpl)
export class SectionServiceImpl extends AbstractBaseService<Section> implements SectionService {
  constructor(
    @inject(IOC_TYPE.SectionRepoImpl) private sectionRepo: SectionRepo,
  ) {
    super();
  }

  search() : any[] {
    const result = this.sectionRepo.getAll();
    return result;
  }

  async add(model: Section): Promise<Section> {
    try {
      return await this.save(model);
    } catch (e) {
      // if (e.message.match('duplicate key value violates unique constraint')) {
      //   throw new AppErrorUserAlreadyExist(e);
      // }
      throw new AppErrorUnexpected(e);
    }
  }

  async save(model: Section): Promise<any> {
    try {
      if (model._key != ''){
        // return await this.edit(model);
        return null;
      } else {
        return await this.add(model);
      }
    } catch(e) {
      throw new AppErrorUnexpected(e);
    }
  }
}