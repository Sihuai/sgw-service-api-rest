import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ProductProductBrand } from '../../../domain/models/product.product.brand';
import { ProductProductBrandRepo } from '../../../infra/repository/product.product.brand.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ProductProductBrandService } from '../product.product.brand.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ProductProductBrandServiceImpl)
export class ProductProductBrandServiceImpl extends AbstractBaseService<ProductProductBrand> implements ProductProductBrandService {
  constructor(
    @inject(IOC_TYPE.ProductProductBrandRepoImpl) private productProductBrandRepo: ProductProductBrandRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<ProductProductBrand[]> {
    return await this.productProductBrandRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<ProductProductBrand> {
    return await this.productProductBrandRepo.selectOneBy(filters);
  }

  async addOne(model: ProductProductBrand): Promise<any> {
    try {
      return await this.productProductBrandRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: ProductProductBrand): Promise<any> {
    try {
      const filters = {_from: model._from, _to: model._to};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.productProductBrandRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}