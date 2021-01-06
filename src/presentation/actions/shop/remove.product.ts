import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopProductService } from '../../../app/service/shop.product.service';
import { IOC_TYPE } from '../../../config/type';
import { IShopProductDTO } from '../../../domain/dtos/i.shop.product.dto';
import { ShopProduct } from '../../../domain/models/shop.product';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.RemoveProductFromShopAction, true)
@provide('action', true)
export class RemoveProductFromShopAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopProductServiceImpl) private shopProductService: ShopProductService,
  ) {}
  execute(token, request: IShopProductDTO) {

    if (isEmptyObject(request.productkey) == true) return -1; // Product Key is empty!
    if (isEmptyObject(request.shopkey) == true) return -2; // Shop Key is empty!
    
    const model = new ShopProduct();
    model._from = 'Product/' + request.productkey;
    model._to = 'Shop/' + request.shopkey;
    model.userLastUpdated = token.email;
    
    return this.shopProductService.removeOne(model);
  }
}
