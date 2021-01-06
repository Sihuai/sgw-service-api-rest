import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopCategoryService } from '../../../app/service/shop.category.service';
import { IOC_TYPE } from '../../../config/type';
import { ShopCategory } from '../../../domain/models/shop.category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteShopCategoryAction, true)
@provide('action', true)
export class DeleteShopCategoryAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopCategoryServiceImpl) private shopcategoryService: ShopCategoryService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new ShopCategory();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.shopcategoryService.removeOne(model);
  }
}
