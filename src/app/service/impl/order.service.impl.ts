import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Order } from '../../../domain/models/order';
import { OrderAddress } from '../../../domain/models/order.address';
import { OrderItem } from '../../../domain/models/order.item';
import { OrderOrderItem } from '../../../domain/models/order.order.item';
import { Price } from '../../../domain/models/price';
import { OrderRepo } from '../../../infra/repository/order.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemService } from '../cart.item.service';
import { OrderAddressService } from '../order.address.service';
import { OrderItemService } from '../order.item.service';
import { OrderOrderItemService } from '../order.order.item.service';
import { OrderService } from '../order.service';
import { TrailService } from '../trail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.OrderServiceImpl)
export class OrderServiceImpl extends AbstractBaseService<Order> implements OrderService {
  constructor(
    @inject(IOC_TYPE.OrderRepoImpl) private orderRepo: OrderRepo,
    @inject(IOC_TYPE.CartItemServiceImpl) private cartItemService: CartItemService,
    @inject(IOC_TYPE.TrailServiceImpl) private trailService: TrailService,
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
    const orders = await this.orderRepo.selectAllBy(filters);

    return orders;
  }

  async findAllByKey(key) : Promise<Order[]> {
    return await this.orderRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<Order> {
    const order = await this.orderRepo.selectOneBy(filters);

    return order;
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
        
        if (orderCurrency != '' && orderCurrency != orderItem.price.currency) return -11; // Have difference currency in one order.
        orderCurrency = orderItem.price.currency;
        orderQty++;

        orderItems.push(orderItem);
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

      // 4.1. Insert into Order collection & OrderItem collection & Order OrderItem edge
      const oResult = await this.orderRepo.insert(order);
      if (oResult == -11) return -12;

      for (let orderItem of orderItems) {
        const oiResult = await this.orderItemService.addOne(orderItem);
        if (oiResult == -11) return -13;

        const ctp = new OrderOrderItem();
        ctp._from = 'Order/' + oResult._key;
        ctp._to = 'OrderItem/' + oiResult._key;
  
        const ctpResult = await this.orderOrderItemService.addOne(ctp);
        if (isEmptyObject(ctpResult) == true) return -14;
      }
      
      // 5. Insert into OrderAddress edge
      if (addressKey != undefined && addressKey != '') {
        const oa = new OrderAddress();
        oa._from = 'Order/' + oResult._key;
        oa._to = 'OrderAddress/' + addressKey;
  
        const oaResult = await this.orderAddressService.addOne(oa);
        if (isEmptyObject(oaResult) == true) return -15;
      }

      // 6. Remove cart items
      for (let cartItem of cartItems) {
        const ciResult = await this.cartItemService.removeOne(cartItem);
        if (isEmptyObject(ciResult) == true) return -16;
        if (ciResult == -10) return -17;
        if (ciResult == -13) return -18;
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
      const ooifilters = {_from: 'Order/' + oResult._key, isActive: true};
      const ooiResult = await this.orderOrderItemService.findAllBy(ooifilters);
      if (isEmptyObject(ooiResult) == true) return -11;

      // 3. Get OrderItem
      const oiKeys: Array<string> = [];
      for (let ooi of ooiResult) {
        oiKeys.push(ooi._to);
      }

      const oiResult = await this.orderItemService.findAllByKey(oiKeys);
      if (isEmptyObject(ooiResult) == true) return -12;

      // 4. Remove OrderItem & Order OrderItem edge
      for (let oi of oiResult) {
        oi.isActive = false;
        oi.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        oi.userLastUpdated = model.userLastUpdated;

        const oiResult = await this.orderItemService.removeOne(oi);
        if (isEmptyObject(oiResult) == true) return -13;
        if (oiResult == -10) return -14;
        if (oiResult == -13) return -15;
      }

      // 5. Remove OrderAddress edge
      const oa = new OrderAddress();
      const oafilters = {_from: 'Order/' + oResult._key, isActive: true};
      const oaResult = await this.orderAddressService.removeBy(model.userLastUpdated, oafilters);
      if (oaResult == false) return -16;
      if (oaResult == -10) return -17;

      // 6. Remove order collection
      oResult.isActive = false;
      oResult.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      oResult.userLastUpdated = model.userLastUpdated;

      return await this.orderRepo.update(oResult);
    } catch (e) {
      throw e;
    }
  }
}