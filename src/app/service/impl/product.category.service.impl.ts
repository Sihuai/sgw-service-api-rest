import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ProductCategory } from '../../../domain/models/product.category';
import { ProductCategoryRepo } from '../../../infra/repository/product.category.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ProductCategoryService } from '../product.category.service';
import { ProductProductCategoryService } from '../product.product.category.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ProductCategoryServiceImpl)
export class ProductCategoryServiceImpl extends AbstractBaseService<ProductCategory> implements ProductCategoryService {
  constructor(
    @inject(IOC_TYPE.ProductCategoryRepoImpl) private productcategoryRepo: ProductCategoryRepo,
    @inject(IOC_TYPE.ProductProductCategoryServiceImpl) private productProductCategoryService: ProductProductCategoryService,
  ) {
    super();
  }

  async findAll() : Promise<ProductCategory[]> {
    return await this.productcategoryRepo.selectAll();
  }

  async findAllBy(filters) : Promise<ProductCategory[]> {
    return await this.productcategoryRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<ProductCategory[]> {
    return await this.productcategoryRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<ProductCategory> {
    return await this.productcategoryRepo.selectOneBy(filters);
  }

  async addOne(model: ProductCategory): Promise<any> {
    try {
      const filters = {name:model.name, isActive:true};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == false) return -10;

      return await this.productcategoryRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: ProductCategory): Promise<any> {
    try {
      const result = await this.productcategoryRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      if (result[0].name != model.name) return -11;

      return await this.productcategoryRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: ProductCategory): Promise<any> {
    try {
      const pcResult = await this.productcategoryRepo.selectAllByKey(model._key);
      if (isEmptyObject(pcResult) == true) return -10;

      const ppcFilters = {_to: 'ProductCategory/' + model._key, isActive: true};
      const ppcResult = await this.productProductCategoryService.findOneBy(ppcFilters);
      if (isEmptyObject(ppcResult) == false) return -11;
  
      pcResult[0].isActive = false;
      pcResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      pcResult[0].userLastUpdated = model.userLastUpdated;

      return await this.productcategoryRepo.update(pcResult[0]);
    } catch (e) {
      throw e;
    }
  }
}