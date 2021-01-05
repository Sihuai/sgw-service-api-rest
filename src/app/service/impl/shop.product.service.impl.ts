import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ShopProduct } from '../../../domain/models/shop.product';
import { ShopProductRepo } from '../../../infra/repository/shop.product.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ShopProductService } from '../shop.product.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ShopProductServiceImpl)
export class ShopProductServiceImpl extends AbstractBaseService<ShopProduct> implements ShopProductService {
  constructor(
    @inject(IOC_TYPE.ShopProductRepoImpl) private shopProductRepo: ShopProductRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<ShopProduct[]> {
    return await this.shopProductRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<ShopProduct> {
    return await this.shopProductRepo.selectOneBy(filters);
  }

  async addOne(model: ShopProduct): Promise<any> {
    try {
      return await this.shopProductRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: ShopProduct): Promise<any> {
    try {
      const filters = {_from: model._from, _to: model._to};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.shopProductRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}