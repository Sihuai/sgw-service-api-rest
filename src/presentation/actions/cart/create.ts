import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartItemService } from '../../../app/service/cart.item.service';
import { IOC_TYPE } from '../../../config/type';
import { ICartDTO } from '../../../domain/dtos/i.cart.dto';
import { CartItem, Option } from '../../../domain/models/cart.item';
import { CartItemDetail } from '../../../domain/models/cart.item.detail';
import { Price } from '../../../domain/models/price';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ICartDTO> {
  typekey: string;
  type: string;
  name: string;
  description: string;
  uri: string;
  qty: number;
  uom: string;
  price: Price;
  options?: Option;
}

@provide(IOC_TYPE.CreateCartAction, true)
@provide('action', true)
export class CreateCartAction implements IAction {
  payloadExample = `  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartItemServiceImpl) private cartItemService: CartItemService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request.typekey) == true) return -1;          // Product/Trail key is empty!
    if (isEmptyObject(request.type) == true) return -2;     // Type is empty!
    if (isEmptyObject(request.name) == true) return -3;     // Name is empty!
    if (isEmptyObject(request.description) == true) return -4;     // Description is empty!
    if (isEmptyObject(request.uri) == true) return -5;      // URI is empty!
    if (request.qty <= 0) return -6;                        // Quantity is empty!
    if (isEmptyObject(request.uom) == true) return -7;      // UOM is empty!
    if (isEmptyObject(request.price) == true) return -8;    // Price is empty!

    if (request.price.value < 0) return -9;    // Price value is less than zero!
    if (isEmptyObject(request.price.currency) == true) return -100;    // Price currency is empty!

    const cartitem = new CartItem();
    cartitem.type = request.type;
    cartitem.name = request.name;
    cartitem.description = request.description;
    cartitem.uri = request.uri;
    cartitem.qty = request.qty;
    cartitem.uom = request.uom;
    cartitem.tag = token.email;
    cartitem.price = request.price;
    cartitem.options = request.options;
    cartitem.userCreated = token.email;
    cartitem.userLastUpdated = token.email;

    return await this.cartItemService.addOne(request.typekey, cartitem);
  }
}