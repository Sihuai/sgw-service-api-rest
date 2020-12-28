import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { CartItem } from '../../../domain/models/cart.item';
import { CartTrailProduct } from '../../../domain/models/cart.trail.product';
import { CartItemRepo } from '../../../infra/repository/cart.item.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemService } from '../cart.item.service';
import { CartTrailProductService } from '../cart.trail.product.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartItemServiceImpl)
export class CartItemServiceImpl extends AbstractBaseService<CartItem> implements CartItemService {
  constructor(
    @inject(IOC_TYPE.CartItemRepoImpl) private cartItemRepo: CartItemRepo,
    @inject(IOC_TYPE.CartTrailProductServiceImpl) private cartTrailProductService: CartTrailProductService,
  ) {
    super();
  }

  async findAll() : Promise<CartItem[]> {
    return await this.cartItemRepo.selectAll();
  }

  async findAllBy(filters) : Promise<CartItem[]> {
    return await this.cartItemRepo.selectAllBy(filters);
  }

  async findAllByKey(filters) : Promise<any> {
    return await this.cartItemRepo.selectAllByKey(filters);
  }

  async findOneBy(filters) : Promise<CartItem> {
    return await this.cartItemRepo.selectOneBy(filters);
  }

  async countBy(filters) : Promise<any> {
    const result = await this.cartItemRepo.countBy(filters);
    if (result == null) return 0;
    return result;
  }

  async addOne(typekey: string, cartItem: CartItem): Promise<any> {
    try {
      // 1. Insert into Cart Item collection.
      const cResult = await this.cartItemRepo.insert(cartItem);
      if (isEmptyObject(cResult) == true) return -11;

      // 2. insert into CartItem Product/Trail edge.
      const ctp = new CartTrailProduct();
      ctp._to = 'CartItem/' + cResult._key;
      switch(cartItem.type)
      {
        case 'PRODUCT':
          ctp._from = 'Product/' + typekey;
          break;
        case 'TRAIL':
          ctp._from = 'TrailDetail/' + typekey;
          break;
      }
      
      const ctpResult = await this.cartTrailProductService.addOne(ctp);
      if (isEmptyObject(ctpResult) == true) return -12;

      return cResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: CartItem): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.cartItemRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.cartItemRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: CartItem): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      // 1. Remove CartItem Trail Product edge
      const ctpFilters = {_to: 'CartItem/' + model._key, isActive: true};
      const ctpResult = await this.cartTrailProductService.removeBy(model.userLastUpdated, ctpFilters);
      if (ctpResult == -10) return -10;
      if (ctpResult == false) return -13;

      // 2. Remove CartItem
      result.isActive = false;
      result.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result.userLastUpdated = model.userLastUpdated;

      return await this.cartItemRepo.update(result);
    } catch (e) {
      throw e;
    }
  }
}