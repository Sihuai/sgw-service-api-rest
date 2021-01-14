import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { GenericEdgeRepo } from '../../../infra/repository/generic.edge.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.GenericEdgeServiceImpl)
export class GenericEdgeServiceImpl extends AbstractBaseService<GenericEdge> implements GenericEdgeService {
  constructor(
    @inject(IOC_TYPE.GenericEdgeRepoImpl) private genericEdgeRepo: GenericEdgeRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<GenericEdge[]> {
    return await this.genericEdgeRepo.selectAllBy(filters);
  }

  async page(filters, pageIndex: number, pageSize: number) : Promise<any> {
    return await this.genericEdgeRepo.page(filters, pageIndex, pageSize);
  }

  async findOneBy(filters) : Promise<GenericEdge> {
    return await this.genericEdgeRepo.selectOneBy(filters);
  }

  async addOne(model: GenericEdge): Promise<any> {
    try {
      return await this.genericEdgeRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: GenericEdge): Promise<any> {
    try {
      var filters;
      if (model.sequence != undefined && model.sequence >= 0) {
        filters = {_from: model._from, _to: model._to, sequence: model.sequence};
      } else {
        filters = {_from: model._from, _to: model._to};
      }
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.genericEdgeRepo.update(result);
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

        const updateResult = await this.genericEdgeRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}