import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductBrandService } from '../../../app/service/product.brand.service';
import { ProductProductBrandService } from '../../../app/service/product.product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductBrandFromProductAction, true)
@provide('action', true)
export class GetProductBrandFromProductAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductProductBrandServiceImpl) private productProductBrandService: ProductProductBrandService,
    @inject(IOC_TYPE.ProductBrandServiceImpl) private productbrandService: ProductBrandService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_from: 'Product/' + key, isActive: true};
    const ppcResult = await this.productProductBrandService.findOneBy(filters);
    if (isEmptyObject(ppcResult) == true) return -2; // No product brand data!
    
    return await this.productbrandService.findAllByKey(ppcResult._to);
  }
}