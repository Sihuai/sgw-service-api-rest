import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductBrandService } from '../../../app/service/product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { ProductBrand } from '../../../domain/models/product.brand';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteProductBrandAction, true)
@provide('action', true)
export class DeleteProductBrandAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductBrandServiceImpl) private productbrandService: ProductBrandService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new ProductBrand();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.productbrandService.removeOne(model);
  }
}
