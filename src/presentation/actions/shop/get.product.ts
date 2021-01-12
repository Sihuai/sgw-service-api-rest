import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductService } from '../../../app/service/product.service';
import { ShopProductService } from '../../../app/service/shop.product.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductFromShopAction, true)
@provide('action', true)
export class GetProductFromShopAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopProductServiceImpl) private shopProductService: ShopProductService,
    @inject(IOC_TYPE.ProductServiceImpl) private productService: ProductService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_from: 'Shop/' + key, isActive: true};
    const result = await this.shopProductService.findAllBy(filters);
    if (isEmptyObject(result) == true) return -2; // No ShopProduct data!
    
    const keys: Array<string> = [];
    for (let sp of result) {
      keys.push(sp._to);
    }

    return await this.productService.findAllByKey(keys);
  }
}