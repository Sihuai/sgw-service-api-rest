import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Section } from '../../../domain/models/section';
import { SectionRepo } from '../../../infra/repository/section.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { SectionService } from '../section.service';
import { TrailService } from '../trail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.SectionServiceImpl)
export class SectionServiceImpl extends AbstractBaseService<Section> implements SectionService {
  constructor(
    @inject(IOC_TYPE.SectionRepoImpl) private sectionRepo: SectionRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.TrailServiceImpl) private trailService: TrailService,
  ) {
    super();
  }

  async findAll() : Promise<Section[]> {
    const sectionFilters = {isActive: true};
    const sections = await this.sectionRepo.selectAllBy(sectionFilters);

    for (let section of sections) {
      const stFilters = {_to: 'Section/' + section._key, isActive: true};
      const sectionTrail = await this.genericEdgeService.page(stFilters, 0, 10);
      if (isEmptyObject(sectionTrail) == true) break;
      
      const keys: Array<string> = [];
      for (let data of sectionTrail.data) {
        keys.push(data._from);
      }
      const trail = await this.trailService.findAllByKey(keys);

      section.trails = trail;
      section.pagination = sectionTrail.pagination;
    }

    return sections;
  }

  async page(sectionKey: string, pageIndex: number, pageSize: number) : Promise<any> {
    const sFilters = {_key: sectionKey, isActive: true};
    const section = await this.sectionRepo.selectOneBy(sFilters);
    if (isEmptyObject(section) == true) return -10;

    const geFilters = {_to: 'Section/' + sectionKey, isActive: true};
    const geResult = await this.genericEdgeService.page(geFilters, pageIndex, pageSize);
    if (isEmptyObject(geResult) == true) return -12;
    
    const keys: Array<string> = [];
    for (let data of geResult.data) {
      keys.push(data._from);
    }
    const trail = await this.trailService.findAllByKey(keys);

    section.trails = trail;
    section.pagination = geResult.pagination;

    return section;
  }

  async findAllBy(filters) : Promise<Section> {
    const sections = await this.sectionRepo.selectAllBy(filters);

    return sections;
  }

  async findOneBy(filters) : Promise<Section> {
    const section = await this.sectionRepo.selectOneBy(filters);

    return section;
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

      return await this.sectionRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Section): Promise<any> {
    try {
      const sectionFilters = {_key: model._key};
      const result = await this.findOneBy(sectionFilters);
      if (isEmptyObject(result) == true) return -10;
  
      const geFilters = {_to: 'Section/' + model._key, isActive: true};
      const geResult = await this.genericEdgeService.findAllBy(geFilters);
      if (isEmptyObject(geResult) == false) return -11; // Exist GenericEdge data!

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.sectionRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}