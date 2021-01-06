import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { ProductService } from '../../../app/service/product.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductDTO } from '../../../domain/dtos/i.product.dto';
import { Product } from '../../../domain/models/product';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.EditProductAction, true)
@provide('action', true)
export class EditProductAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductServiceImpl) private productService: ProductService,
  ) {}
  async execute(token, request: IProductDTO) : Promise<any> {

    if (isEmptyObject(request.sku) == true) return -1; // SKU is empty!
    if (isEmptyObject(request.uom) == true) return -2; // UOM is empty!
    if (isEmptyObject(request.name) == true) return -3; // Name is empty!
    if (isEmptyObject(request.description) == true) return -4; // Description is empty!
    if (isEmptyObject(request.isLocked) == true) return -5; // Is locked is empty!
    if (isEmptyObject(request.options) == true) return -6; // Options is empty!
    if (isEmptyObject(request.delivery) == true) return -7; // Delivery is empty!

    if (isEmptyObject(request.price) == true) return -8; // Price is empty!
    if (request.price.value < 0) return -9;                          // Price value is less than zero!
    if (isEmptyObject(request.price.currency) == true) return -100;    // Price currency is empty!

    if (isEmptyObject(request.posters) == true) return -101; // Posters is empty!

    for (const poster of request.posters) {
      if (isEmptyObject(poster.type) == true) return -102; // Posters type is empty!
      if (isEmptyObject(poster.orientation) == true) return -103; // Posters orientation is empty!
      if (isEmptyObject(poster.format) == true) return -104; // Posters format is empty!
      if (isEmptyObject(poster.uri) == true) return -105; // Posters uri is empty!
    }

    if (isEmptyObject(request._key) == true) return -106; // Product key is empty!

    const model = new Product();
    model.sku = request.sku;
    model.uom = request.uom;
    model.name = request.name;
    model.description = request.description;
    model.isLocked = request.isLocked;
    model.options = request.options;
    model.delivery = request.delivery;
    model.price = request.price;
    model.posters = request.posters;
    model._key = request._key;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;
    
    return await this.productService.editOne(model);
  }
}