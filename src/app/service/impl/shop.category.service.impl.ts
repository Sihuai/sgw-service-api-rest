import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ShopCategory } from '../../../domain/models/shop.category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ShopCategoryService } from '../shop.category.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ShopCategoryServiceImpl)
export class ShopCategoryServiceImpl extends AbstractBaseService<ShopCategory> implements ShopCategoryService {
  constructor(
    // @inject(IOC_TYPE.ShopShopCategoryServiceImpl) private shopShopCategoryService: ShopShopCategoryService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<ShopCategory[]> {

    var shopCategories: Array<ShopCategory> = [];
    return shopCategories;
  }
}