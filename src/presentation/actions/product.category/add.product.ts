import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductProductCategoryService } from '../../../app/service/product.product.category.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductProductCategoryDTO } from '../../../domain/dtos/i.product.product.category.dto';
import { ProductProductCategory } from '../../../domain/models/product.product.category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.AddProductAction, true)
@provide('action', true)
export class AddProductAction implements IAction {
  payloadExample = `
  {
    "productkey": "123456",
    "productcategorykey": "654321"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductProductCategoryServiceImpl) private productProductCategoryService: ProductProductCategoryService,
  ) {}
  async execute(token, request: IProductProductCategoryDTO) : Promise<any> {

    if (isEmptyObject(request.productkey) == true) return -1; // Product Key is empty!
    if (isEmptyObject(request.productcategorykey) == true) return -2; // Product Category Key is empty!

    const model = new ProductProductCategory();
    model._from = 'Product/' + request.productkey;
    model._to = 'ProductCategory/' + request.productcategorykey;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.productProductCategoryService.addOne(model);
  }
}