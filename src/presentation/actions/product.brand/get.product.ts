import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { ProductService } from '../../../app/service/product.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductFromBrandAction, true)
@provide('action', true)
export class GetProductFromBrandAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.ProductServiceImpl) private productService: ProductService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_to: 'ProductBrand/' + key, isActive: true};
    const result = await this.genericEdgeService.findAllBy(filters);
    if (isEmptyObject(result) == true) return -2; // No product data!

    const keys: Array<string> = [];
    for (let ppc of result) {
      keys.push(ppc._from);
    }

    return await this.productService.findAllByKey(keys);
  }
}