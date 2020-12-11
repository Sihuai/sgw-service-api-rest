import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Category } from '../../../domain/models/category';
import { CategoryRepo } from '../../../infra/repository/category.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CategoryService } from '../category.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CategoryServiceImpl)
export class CategoryServiceImpl extends AbstractBaseService<Category> implements CategoryService {
  constructor(
    @inject(IOC_TYPE.CategoryRepoImpl) private categoryRepo: CategoryRepo,
  ) {
    super();
  }

  async findAll() : Promise<Category[]> {
    return await this.categoryRepo.selectAll();
  }

  async findOneBy(filters) : Promise<Category> {
    return await this.categoryRepo.selectOneBy(filters);
  }

  async addOne(model: Category): Promise<any> {
    try {
      return await this.categoryRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Category): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.categoryRepo.existsBy(filters);
      if (isExisted == false) return -3;

      const result = this.removeOne(model);

      return await this.addOne(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Category): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -3;
  
      return await this.categoryRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}