import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { OrderTypes } from '../../../domain/enums/order.types';
import { CartItemOrderItem } from '../../../domain/models/cart.item.order.item';
import { Order } from '../../../domain/models/order';
import { OrderAddress } from '../../../domain/models/order.address';
import { OrderItem } from '../../../domain/models/order.item';
import { OrderOrderItem } from '../../../domain/models/order.order.item';
import { Price } from '../../../domain/models/price';
import { OrderRepo } from '../../../infra/repository/order.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemOrderItemService } from '../cart.item.order.item.service';
import { CartItemService } from '../cart.item.service';
import { OrderAddressService } from '../order.address.service';
import { OrderItemService } from '../order.item.service';
import { OrderOrderItemService } from '../order.order.item.service';
import { OrderService } from '../order.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderServiceImpl)
export class OrderServiceImpl extends AbstractBaseService<Order> implements OrderService {
  constructor(
    @inject(IOC_TYPE.OrderRepoImpl) private orderRepo: OrderRepo,
    @inject(IOC_TYPE.CartItemServiceImpl) private cartItemService: CartItemService,
    @inject(IOC_TYPE.CartItemOrderItemServiceImpl) private cartItemOrderItemService: CartItemOrderItemService,
    @inject(IOC_TYPE.OrderItemServiceImpl) private orderItemService: OrderItemService,
    @inject(IOC_TYPE.OrderOrderItemServiceImpl) private orderOrderItemService: OrderOrderItemService,
    @inject(IOC_TYPE.OrderAddressServiceImpl) private orderAddressService: OrderAddressService,
  ) {
    super();
  }

  async page(filters, pageIndex: number, pageSize: number) : Promise<any> {
    return await this.orderRepo.page(filters, pageIndex, pageSize);
  }

  async findAllBy(filters) : Promise<Order[]> {
    return await this.orderRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<Order[]> {
    return await this.orderRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<Order> {
    return await this.orderRepo.selectOneBy(filters);
  }

  async addOne(email: string, addressKey: string, filters): Promise<any> {
    try {
      // 1. Get cart item
      const cartItems = await this.cartItemService.findAllBy(filters);

      // 2. Map cart item to order item
      const orderItems: Array<OrderItem> = [];
      var orderAmount = 0;
      var orderCurrency = '';
      var orderQty = 0;
      var hasProductType = false;
      for (let cartItem of cartItems) {
        const orderItem = new OrderItem();

        orderItem.type = cartItem.type;
        orderItem.name = cartItem.name;
        orderItem.description = cartItem.description;
        orderItem.uri = cartItem.uri;
        orderItem.qty = cartItem.qty;
        orderItem.uom = cartItem.uom;
        orderItem.tag = cartItem.tag;
        orderItem.price = cartItem.price;
        orderItem.options = cartItem.options;
        orderItem.status = 'NEW';
        orderItem.userCreated = email;
        orderItem.userLastUpdated = email;

        const amount = new Price();
        amount.value = orderItem.qty * orderItem.price.value;
        amount.currency = orderItem.price.currency;
        if (orderItem.price.taxable == true && orderItem.price.taxIncluded == false){
          if (orderItem.price.taxInPercentage != undefined) amount.value = amount.value + amount.value * orderItem.price.taxInPercentage;
        }

        orderItem.amount = amount;

        orderAmount += orderItem.price.value;
        // Have difference currency in one order.
        if (orderCurrency != '' && orderCurrency != orderItem.price.currency) return -11;
        orderCurrency = orderItem.price.currency;
        orderQty++;

        // Check has product type or not
        if (orderItem.type == OrderTypes.PRODUCT) hasProductType = true;

        orderItems.push(orderItem);
      }

      if (hasProductType == true) {
        if (isEmptyObject(addressKey) == true) return -12;
      }

      // 3. Map order, and insert into Order collection
      const amount = new Price();
      amount.value = orderAmount;
      amount.currency = orderCurrency;

      const order = new Order();
      order.tag = email;
      order.quantity = orderQty;
      order.status = 'NEW';
      order.amount = amount;
      order.userCreated = email;
      order.userLastUpdated = email;

      // 4.1. Insert into Order collection
      const oResult = await this.orderRepo.insert(order);
      if (oResult == -11) return -13;

      // 4.2. Insert into OrderItem collection & Order OrderItem edge
      for (let orderItem of orderItems) {
        const oiResult = await this.orderItemService.addOne(orderItem);
        if (oiResult == -11) return -14;

        const ctp = new OrderOrderItem();
        ctp._from = 'Order/' + oResult._key;
        ctp._to = 'OrderItem/' + oiResult._key;
        ctp.userCreated = email;
        ctp.userLastUpdated = email;
  
        // 4.2.1. Insert into OrderOrderItem edge
        const ctpResult = await this.orderOrderItemService.addOne(ctp);
        if (isEmptyObject(ctpResult) == true) return -15;

        // 4.2.2. Insert into CartItemOrderItem edge
        var cartItemKey = '';
        cartItems.forEach((cartItem) => {
          if (cartItem.name == orderItem.name) {
            cartItemKey = cartItem._key;
            return false;
          }
        })
        const cioi = new CartItemOrderItem();
        cioi._from = 'CartItem/' + cartItemKey;
        cioi._to = 'OrderItem/' + oiResult._key;
        cioi.userCreated = email;
        cioi.userLastUpdated = email;
  
        const cioiResult = await this.cartItemOrderItemService.addOne(cioi);
        if (isEmptyObject(cioiResult) == true) return -16;
      }
      
      // 5. Insert into OrderAddress edge
      if (addressKey != undefined && addressKey != '') {
        const oa = new OrderAddress();
        oa._from = 'Order/' + oResult._key;
        oa._to = 'OrderAddress/' + addressKey;
        oa.userCreated = email;
        oa.userLastUpdated = email;
  
        const oaResult = await this.orderAddressService.addOne(oa);
        if (isEmptyObject(oaResult) == true) return -17;
      }

      // 6. Remove cart items
      for (let cartItem of cartItems) {
        const ciResult = await this.cartItemService.removeOne(cartItem);
        if (isEmptyObject(ciResult) == true) return -18;
        if (ciResult == -10) return -19;
        if (ciResult == -13) return -20;
      }

      return oResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Order): Promise<any> {
    try {
      // const filters = {_key: model._key};
      // const isExisted = await this.orderRepo.existsBy(filters);
      // if (isExisted == false) return -11;

      return await this.orderRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Order): Promise<any> {
    try {
      // 1. Get order
      const oFilters = {_key: model._key};
      const oResult = await this.findOneBy(oFilters);
      if (isEmptyObject(oResult) == true) return -10;
  
      // 2. Get Order OrderItem edge
      const ooiFilters = {_from: 'Order/' + oResult._key, isActive: true};
      const ooiResult = await this.orderOrderItemService.findAllBy(ooiFilters);
      if (isEmptyObject(ooiResult) == true) return -11;

      // 3. Get OrderItem
      const oiKeys: Array<string> = [];
      for (let ooi of ooiResult) {
        oiKeys.push(ooi._to);
      }

      const oiResult = await this.orderItemService.findAllByKey(oiKeys);
      if (isEmptyObject(oiResult) == true) return -12;

      // 4. Get CartItemOrderItem edge
      var hasProductType = false;
      const cioiResults: Array<CartItemOrderItem> = [];
      for (let oi of oiResult) {
        const cioiFilters = {_to: 'OrderItem/' + oi._key, isActive: true};
        const cioiResult = await this.cartItemOrderItemService.findOneBy(cioiFilters);
        if (isEmptyObject(cioiResult) == true) return -13;

        // Check has product type or not
        if (oi.type == OrderTypes.PRODUCT) hasProductType = true;
        
        cioiResult.isActive = false;
        cioiResult.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        cioiResult.userLastUpdated = model.userLastUpdated;
        cioiResults.push(cioiResult);
      }
      
      // 5. Remove OrderItem & Order OrderItem edge
      for (let oi of oiResult) {
        oi.isActive = false;
        oi.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        oi.userLastUpdated = model.userLastUpdated;

        const oiResult = await this.orderItemService.removeOne(oi);
        if (isEmptyObject(oiResult) == true) return -14;
        if (oiResult == -10) return -15;
        if (oiResult == -13) return -16;
      }

      if (hasProductType == true) {
        // 6. Remove OrderAddress edge
        const oa = new OrderAddress();
        const oafilters = {_from: 'Order/' + oResult._key, isActive: true};
        const oaResult = await this.orderAddressService.removeBy(model.userLastUpdated, oafilters);
        if (oaResult == false) return -17;
        if (oaResult == -10) return -18;
      }
      
      // 7. Remove CartItemOrderItem edge
      for (let cioi of cioiResults) {
        const cioiResult = await this.cartItemOrderItemService.removeOne(cioi);
        if (isEmptyObject(cioiResult) == true) return -19;
      }

      // 8. Remove order collection
      oResult.isActive = false;
      oResult.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      oResult.userLastUpdated = model.userLastUpdated;

      return await this.orderRepo.update(oResult);
    } catch (e) {
      throw e;
    }
  }
}