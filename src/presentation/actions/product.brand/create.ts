import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductBrandService } from '../../../app/service/product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductBrandDTO } from '../../../domain/dtos/i.product.brand.dto';
import { ProductBrand } from '../../../domain/models/product.brand';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateProductBrandAction, true)
@provide('action', true)
export class CreateProductBrandAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductBrandServiceImpl) private productbrandService: ProductBrandService,
  ) {}
  async execute(token, request: IProductBrandDTO) : Promise<any> {

    if (isEmptyObject(request.name) == true) return -1; // Name is empty!
    if (isEmptyObject(request.description) == true) return -2; // Description is empty!

    const model = new ProductBrand();
    model.sequence = 0;
    model.name = request.name;
    model.description = request.description;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.productbrandService.addOne(model);
  }
}