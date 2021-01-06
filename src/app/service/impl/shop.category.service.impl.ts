import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ShopCategory } from '../../../domain/models/shop.category';
import { ShopCategoryRepo } from '../../../infra/repository/shop.category.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ShopCategoryService } from '../shop.category.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ShopCategoryServiceImpl)
export class ShopCategoryServiceImpl extends AbstractBaseService<ShopCategory> implements ShopCategoryService {
  constructor(
    @inject(IOC_TYPE.ShopCategoryRepoImpl) private shopcategoryRepo: ShopCategoryRepo,
    // @inject(IOC_TYPE.ShopShopCategoryServiceImpl) private shopShopCategoryService: ShopShopCategoryService,
  ) {
    super();
  }

  async findAll() : Promise<ShopCategory[]> {
    return await this.shopcategoryRepo.selectAll();
  }

  async findAllBy(filters) : Promise<ShopCategory[]> {
    return await this.shopcategoryRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<ShopCategory[]> {
    return await this.shopcategoryRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<ShopCategory> {
    return await this.shopcategoryRepo.selectOneBy(filters);
  }

  async addOne(model: ShopCategory): Promise<any> {
    try {
      return await this.shopcategoryRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: ShopCategory): Promise<any> {
    try {
      const result = await this.shopcategoryRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      result[0].type = model.type;
      result[0].categories = model.categories;
      result[0].trails = model.trails;
      result[0].datetimeLastEdited = model.datetimeLastEdited;
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.shopcategoryRepo.update(result[0]);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: ShopCategory): Promise<any> {
    try {
      const pcResult = await this.shopcategoryRepo.selectAllByKey(model._key);
      if (isEmptyObject(pcResult) == true) return -10;

      // const ppcFilters = {_to: 'ShopCategory/' + model._key, isActive: true};
      // const ppcResult = await this.shopShopCategoryService.findOneBy(ppcFilters);
      // if (isEmptyObject(ppcResult) == false) return -11;
  
      pcResult[0].isActive = false;
      pcResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      pcResult[0].userLastUpdated = model.userLastUpdated;

      return await this.shopcategoryRepo.update(pcResult[0]);
    } catch (e) {
      throw e;
    }
  }
}