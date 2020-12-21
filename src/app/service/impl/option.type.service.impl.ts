import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OptionType } from '../../../domain/models/option.type';
import { OptionTypeRepo } from '../../../infra/repository/option.type.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { OptionTypeService } from '../option.type.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OptionTypeServiceImpl)
export class OptionTypeServiceImpl extends AbstractBaseService<OptionType> implements OptionTypeService {
  constructor(
    @inject(IOC_TYPE.OptionTypeRepoImpl) private optionTypeRepo: OptionTypeRepo,
  ) {
    super();
  }

  async findAll() : Promise<OptionType[]> {
    return await this.optionTypeRepo.selectAll();
  }

  async findAllBy(filters) : Promise<any> {
    return await this.optionTypeRepo.selectAllBy(filters);
  }

  async addOne(model: OptionType): Promise<any> {
    try {
      return await this.optionTypeRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: OptionType): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.optionTypeRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.optionTypeRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: OptionType): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.optionTypeRepo.selectOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;
  
      return await this.optionTypeRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}