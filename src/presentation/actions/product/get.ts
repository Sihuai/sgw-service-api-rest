import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductService } from '../../../app/service/product.service';
import { IOC_TYPE } from '../../../config/type';
import { Product } from '../../../domain/models/product';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetProductAction, true)
@provide('action', true)
export class GetProductAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductServiceImpl) private productService: ProductService,
  ) { }
  async execute() : Promise<any>  {

    const filters = {isActive: true};
    return await this.productService.findAllBy(filters);
  }
}