import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Section, Sections } from '../../../domain/models/section';
import { AppErrorUnexpected } from '../../errors/unexpected';
import { SectionService } from '../section.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.SectionServiceImpl)
export class SectionServiceImpl extends AbstractBaseService<Section> implements SectionService {
    find1() : any[] {
      const result = Sections.find();
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

    async save(model: Section): Promise<Section> {
      try {
        if (model._key != ''){
          return await this.edit(model);
        } else {
          return await this.add(model);
        }
      } catch(e) {
        throw new AppErrorUnexpected(e);
      }
    }
}
