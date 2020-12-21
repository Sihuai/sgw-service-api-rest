import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Section } from '../../../domain/models/section';
import { SectionRepo } from '../../../infra/repository/section.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { SectionService } from '../section.service';
import { SectionTrailService } from '../section.trail.service';
import { TrailService } from '../trail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.SectionServiceImpl)
export class SectionServiceImpl extends AbstractBaseService<Section> implements SectionService {
  constructor(
    @inject(IOC_TYPE.SectionRepoImpl) private sectionRepo: SectionRepo,
    @inject(IOC_TYPE.SectionTrailServiceImpl) private sectionTrailService: SectionTrailService,
    @inject(IOC_TYPE.TrailServiceImpl) private trailService: TrailService,
  ) {
    super();
  }

  async findAll() : Promise<Section[]> {
    const sectionFilters = {isActive: true};
    const sections = await this.sectionRepo.selectAllBy(sectionFilters);

    for (let section of sections) {
      const stFilters = {_from: 'Section/' + section._key, isActive: true};
      const sectionTrail = await this.sectionTrailService.page(stFilters, 0, 10);
      if (isEmptyObject(sectionTrail) == true) break;
      
      const keys: Array<string> = [];
      for (let data of sectionTrail.data) {
        keys.push(data._to);
      }
      const trail = await this.trailService.findAllByKey(keys);

      section.trails = trail;
      section.pagination = sectionTrail.pagination;
    }

    return sections;
  }

  async page(sectionKey: string, pageIndex: number, pageSize: number) : Promise<any> {
    const section = await this.sectionRepo.selectAllByKey(sectionKey);

    const stFilters = {_from: 'Section/' + sectionKey, isActive: true};
    const sectionTrail = await this.sectionTrailService.page(stFilters, pageIndex, pageSize);
    if (isEmptyObject(sectionTrail) == true) return -12;
    
    const keys: Array<string> = [];
    for (let data of sectionTrail.data) {
      keys.push(data._to);
    }
    const trail = await this.trailService.findAllByKey(keys);

    section[0].trails = trail;
    section[0].pagination = sectionTrail.pagination;

    return section[0];
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
  
      // 1. Remove section trail relation collection
      const stFilters = {_from: 'Section/' + result._key};
      const stResult = await this.sectionTrailService.removeBy(model.userLastUpdated, stFilters);
      // if (stResult == -10) return -10;
      // if (stResult == false) return -13;

      // 2. Remove section collection
      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.sectionRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}