import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { CartItemService } from '../../../app/service/cart.item.service';
import { IOC_TYPE } from '../../../config/type';
import { ICartDTO } from '../../../domain/dtos/i.cart.dto';
import { CartItem, Option } from '../../../domain/models/cart.item';
import { Price } from '../../../domain/models/price';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ICartDTO> {
  _key: string;
  // typekey: string;
  type: string;
  name: string;
  description: string;
  uri: string;
  qty: number;
  uom: string;
  price: Price;
  options?: Option;
}

@provide(IOC_TYPE.EditCartAction, true)
@provide('action', true)
export class EditCartAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartItemServiceImpl) public cartItemService: CartItemService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    // if (isEmptyObject(request.typekey) == true) return -1;          // Product/Trail key is empty!
    if (isEmptyObject(request.type) == true) return -2;     // Type is empty!
    if (isEmptyObject(request.name) == true) return -3;     // Name is empty!
    if (isEmptyObject(request.description) == true) return -4;     // Description is empty!
    if (isEmptyObject(request.uri) == true) return -5;      // URI is empty!
    if (request.qty <= 0) return -6;                        // Quantity is empty!
    if (isEmptyObject(request.uom) == true) return -7;      // UOM is empty!
    if (isEmptyObject(request.price) == true) return -8;    // Price is empty!

    if (request.price.value < 0) return -9;    // Price value is less than zero!
    if (isEmptyObject(request.price.currency) == true) return -100;    // Price currency is empty!

    if (isEmptyObject(request._key) == true) return -101;       // CartItem key is empty!

    const model = new CartItem();
    model._key = request._key;
    model.type = request.type;
    model.name = request.name;
    model.description = request.description;
    model.uri = request.uri;
    model.qty = request.qty;
    model.uom = request.uom;
    model.tag = token.email;
    model.price = request.price;
    model.options = request.options;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;

    return await this.cartItemService.editOne(model);
  }
}