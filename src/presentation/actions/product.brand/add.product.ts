import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductProductBrandService } from '../../../app/service/product.product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductProductBrandDTO } from '../../../domain/dtos/i.product.product.brand.dto';
import { ProductProductBrand } from '../../../domain/models/product.product.brand';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.AddProductToBrandAction, true)
@provide('action', true)
export class AddProductToBrandAction implements IAction {
  payloadExample = `
  {
    "productkey": "123456",
    "productbrandkey": "654321"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductProductBrandServiceImpl) private productProductBrandService: ProductProductBrandService,
  ) {}
  async execute(token, request: IProductProductBrandDTO) : Promise<any> {

    if (isEmptyObject(request.productkey) == true) return -1; // Product Key is empty!
    if (isEmptyObject(request.productbrandkey) == true) return -2; // Product Brand Key is empty!

    const model = new ProductProductBrand();
    model._from = 'Product/' + request.productkey;
    model._to = 'ProductBrand/' + request.productbrandkey;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.productProductBrandService.addOne(model);
  }
}