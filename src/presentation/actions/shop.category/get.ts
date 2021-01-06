import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopCategoryService } from '../../../app/service/shop.category.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetShopCategoryAction, true)
@provide('action', true)
export class GetShopCategoryAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopCategoryServiceImpl) private shopcategoryService: ShopCategoryService,
  ) { }
  async execute() : Promise<any>  {

    const filters = {isActive: true};
    return await this.shopcategoryService.findAllBy(filters);
  }
}