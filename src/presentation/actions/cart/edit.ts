import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { CartService } from '../../../app/service/cart.service';
import { IOC_TYPE } from '../../../config/type';
import { ICartDTO } from '../../../domain/dtos/i.cart.dto';
import { Cart, Option } from '../../../domain/models/cart';
import { Price } from '../../../domain/models/price';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ICartDTO> {
  _key: string;
  type: string;
  name: string;
  uri: string;
  qty: number;
  uom: string;
  tag: string;
  price: Price;
  options?: Option;
}

@provide(IOC_TYPE.EditCartAction, true)
@provide('action', true)
export class EditCartAction implements IAction {
  payloadExample = `
  {
    "type": "PRODUCT",
    "name": "Product E-3",
    "uri": "https://via.placeholder.com/450x315.png",
    "price": {
      "value": 5.99,
      "currency": "SGD",
      "taxable": false
    },
    "qty": 1,
    "uom": "PACK",
    "option": {
      "weight": "500g"
    },
    "delivery": {
      "option": "DOOR-TO-DOOR",
      "address": {
        "country": "SG",
        "block": "40",
        "propertyName": "The Excell",
        "street": "East Coast Road",
        "unit": "#03-80"
      }
    },
    "tag": "Users/740948",
    "datetimeCreated": "2020-12-02 15:44:18 +00:00",
    "userCreated": {
      "_id": "Users/740948",
      "_key": "740948",
      "nick": "Dylan"
    }
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartServiceImpl) public cartService: CartService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request._key) == true) return -1;       // Product key is empty!
    if (isEmptyObject(request.type) == true) return -2;     // Type is empty!
    if (isEmptyObject(request.name) == true) return -3;     // Name is empty!
    if (isEmptyObject(request.uri) == true) return -4;      // URI is empty!
    if (request.qty <= 0) return -5;                        // Quantity is empty!
    if (isEmptyObject(request.uom) == true) return -6;      // UOM is empty!
    if (isEmptyObject(request.tag) == true) return -7;      // Tag is empty!
    if (isEmptyObject(request.price) == true) return -8;    // Price is empty!

    const model = new Cart();
    model._key = request._key;
    model.type = request.type;
    model.name = request.name;
    model.uri = request.uri;
    model.qty = request.qty;
    model.uom = request.uom;
    model.tag = request.tag;
    model.price = request.price;
    model.options = request.options;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    
    return await this.cartService.editOne(model);
  }
}