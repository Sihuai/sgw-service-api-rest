import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductCategoryService } from '../../../app/service/product.category.service';
import { IOC_TYPE } from '../../../config/type';
import { ProductCategory } from '../../../domain/models/product.category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteProductCategoryAction, true)
@provide('action', true)
export class DeleteProductCategoryAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductCategoryServiceImpl) private productcategoryService: ProductCategoryService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new ProductCategory();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.productcategoryService.removeOne(model);
  }
}
