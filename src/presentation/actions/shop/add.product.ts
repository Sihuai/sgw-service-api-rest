import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopProductService } from '../../../app/service/shop.product.service';
import { IOC_TYPE } from '../../../config/type';
import { IShopProductDTO } from '../../../domain/dtos/i.shop.product.dto';
import { ShopProduct } from '../../../domain/models/shop.product';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.AddProductToShopAction, true)
@provide('action', true)
export class AddProductToShopAction implements IAction {
  payloadExample = `
  {
    "animationplaybackkey": "2589592",
    "shopkey": "1758453"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopProductServiceImpl) private shopProductService: ShopProductService,
  ) {}
  async execute(token, request: IShopProductDTO) : Promise<any> {

    if (isEmptyObject(request.productkey) == true) return -1; // Product Key is empty!
    if (isEmptyObject(request.shopkey) == true) return -2; // Shop Key is empty!
    
    const model = new ShopProduct();
    model._from = 'Product/' + request.productkey;
    model._to = 'Shop/' + request.shopkey;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.shopProductService.addOne(model);
  }
}