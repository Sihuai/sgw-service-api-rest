import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { ProductBrandService } from '../../../app/service/product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductBrandFromProductAction, true)
@provide('action', true)
export class GetProductBrandFromProductAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.ProductBrandServiceImpl) private productbrandService: ProductBrandService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_from: 'Product/' + key, isActive: true};
    const result = await this.genericEdgeService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -2; // No GenericEdge data!
    
    return await this.productbrandService.findAllByKey(result._to);
  }
}