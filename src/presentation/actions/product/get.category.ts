import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { ProductCategoryService } from '../../../app/service/product.category.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductCategoryFromProductAction, true)
@provide('action', true)
export class GetProductCategoryFromProductAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.ProductCategoryServiceImpl) private productcategoryService: ProductCategoryService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_from: 'Product/' + key, tag: 'ProductCategory', isActive: true};
    const result = await this.genericEdgeService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -2; // No GenericEdge data!
    
    return await this.productcategoryService.findAllByKey(result._to);
  }
}