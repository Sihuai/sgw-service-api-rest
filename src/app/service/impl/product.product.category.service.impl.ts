import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ProductProductCategory } from '../../../domain/models/product.product.category';
import { ProductProductCategoryRepo } from '../../../infra/repository/product.product.category.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ProductProductCategoryService } from '../product.product.category.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ProductProductCategoryServiceImpl)
export class ProductProductCategoryServiceImpl extends AbstractBaseService<ProductProductCategory> implements ProductProductCategoryService {
  constructor(
    @inject(IOC_TYPE.ProductProductCategoryRepoImpl) private productProductCategoryRepo: ProductProductCategoryRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<ProductProductCategory[]> {
    return await this.productProductCategoryRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<ProductProductCategory> {
    return await this.productProductCategoryRepo.selectOneBy(filters);
  }

  async addOne(model: ProductProductCategory): Promise<any> {
    try {
      return await this.productProductCategoryRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: ProductProductCategory): Promise<any> {
    try {
      const filters = {_from: model._from, _to: model._to};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.productProductCategoryRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}