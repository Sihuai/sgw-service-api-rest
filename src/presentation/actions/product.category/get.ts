import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductCategoryService } from '../../../app/service/product.category.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductCategoryAction, true)
@provide('action', true)
export class GetProductCategoryAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductCategoryServiceImpl) private productcategoryService: ProductCategoryService,
  ) { }
  async execute() : Promise<any>  {

    const filters = {isActive: true};
    return await this.productcategoryService.findAllBy(filters);
  }
}