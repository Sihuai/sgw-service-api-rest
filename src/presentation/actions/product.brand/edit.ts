import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { ProductBrandService } from '../../../app/service/product.brand.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductBrandDTO } from '../../../domain/dtos/i.product.brand.dto';
import { ProductBrand } from '../../../domain/models/product.brand';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.EditProductBrandAction, true)
@provide('action', true)
export class EditProductBrandAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductBrandServiceImpl) private productbrandService: ProductBrandService,
  ) {}
  async execute(token, request: IProductBrandDTO) : Promise<any> {

    if (isEmptyObject(request.name) == true) return -1; // Name is empty!
    if (isEmptyObject(request.description) == true) return -2; // Description is empty!

    if (isEmptyObject(request._key) == true) return -3; // Product Brand key is empty!

    const model = new ProductBrand();
    model.name = request.name;
    model.description = request.description;
    model._key = request._key;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;
    
    return await this.productbrandService.editOne(model);
  }
}