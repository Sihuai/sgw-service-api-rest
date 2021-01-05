import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductService } from '../../../app/service/product.service';
import { IOC_TYPE } from '../../../config/type';
import { Product } from '../../../domain/models/product';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteProductAction, true)
@provide('action', true)
export class DeleteProductAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductServiceImpl) private productService: ProductService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Product();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.productService.removeOne(model);
  }
}
