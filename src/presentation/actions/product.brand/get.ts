import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductBrandService } from '../../../app/service/product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductBrandAction, true)
@provide('action', true)
export class GetProductBrandAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductBrandServiceImpl) private productbrandService: ProductBrandService,
  ) { }
  async execute() : Promise<any>  {

    const filters = {isActive: true};
    return await this.productbrandService.findAllBy(filters);
  }
}