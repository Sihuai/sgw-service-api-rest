import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductService } from '../../../app/service/product.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductDTO } from '../../../domain/dtos/i.product.dto';
import { Product } from '../../../domain/models/product';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateProductAction, true)
@provide('action', true)
export class CreateProductAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductServiceImpl) private productService: ProductService,
  ) {}
  async execute(token, request: IProductDTO) : Promise<any> {

    if (isEmptyObject(request.sku) == true) return -1; // SKU is empty!
    if (isEmptyObject(request.name) == true) return -2; // Name is empty!
    if (isEmptyObject(request.description) == true) return -3; // Description is empty!
    if (isEmptyObject(request.options) == true) return -4; // Options is empty!
    if (isEmptyObject(request.delivery) == true) return -5; // Delivery is empty!

    if (isEmptyObject(request.price) == true) return -6; // Price is empty!
    if (request.price.value < 0) return -7;                          // Price value is less than zero!
    if (isEmptyObject(request.price.currency) == true) return -8;    // Price currency is empty!

    if (isEmptyObject(request.posters) == true) return -9; // Posters is empty!

    for (const poster of request.posters) {
      if (isEmptyObject(poster.type) == true) return -100; // Posters type is empty!
      if (isEmptyObject(poster.orientation) == true) return -101; // Posters orientation is empty!
      if (isEmptyObject(poster.format) == true) return -102; // Posters format is empty!
      if (isEmptyObject(poster.uri) == true) return -103; // Posters uri is empty!
    }

    const model = new Product();
    model.sku = request.sku;
    model.name = request.name;
    model.description = request.description;
    model.options = request.options;
    model.delivery = request.delivery;
    model.price = request.price;
    model.posters = request.posters;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.productService.addOne(model);
  }
}