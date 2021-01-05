import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductCategoryService } from '../../../app/service/product.category.service';
import { ProductProductCategoryService } from '../../../app/service/product.product.category.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductCategoryAction, true)
@provide('action', true)
export class GetProductCategoryAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductProductCategoryServiceImpl) private productProductCategoryService: ProductProductCategoryService,
    @inject(IOC_TYPE.ProductCategoryServiceImpl) private productcategoryService: ProductCategoryService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_from: 'Product/' + key, isActive: true};
    const ppcResult = await this.productProductCategoryService.findOneBy(filters);
    if (isEmptyObject(ppcResult) == true) return -2; // No product category data!
    
    return await this.productcategoryService.findAllByKey(ppcResult._to);
  }
}