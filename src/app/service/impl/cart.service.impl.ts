import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Cart } from '../../../domain/models/cart';
import { CartProduct } from '../../../domain/models/cart.product';
import { CartRepo } from '../../../infra/repository/cart.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartService } from '../cart.service';
import { AbstractBaseService } from './base.service.impl';
import { CartProductServiceImpl } from './cart.product.service.impl';

@provide(IOC_TYPE.CartServiceImpl)
export class CartServiceImpl extends AbstractBaseService<Cart> implements CartService {
  constructor(
    @inject(IOC_TYPE.CartRepoImpl) private cartRepo: CartRepo,
    @inject(IOC_TYPE.CartProductServiceImpl) private cartProductService: CartProductServiceImpl,
  ) {
    super();
  }

  async findAll() : Promise<Cart[]> {
    return await this.cartRepo.selectAll();
  }

  async findAllBy(filters) : Promise<Cart> {
    return await this.cartRepo.selectAllBy(filters);
  }

  async findAllByKey(filters) : Promise<any> {
    return await this.cartRepo.selectAllByKey(filters);
  }

  async findOneBy(filters) : Promise<Cart> {
    return await this.cartRepo.selectOneBy(filters);
  }

  async countBy(filters) : Promise<any> {
    return await this.cartRepo.countBy(filters);
  }

  async addOne(typekey: string, model: Cart): Promise<any> {
    try {
      // 1. Insert into cart collection.
      const cartResult = await this.cartRepo.insert(model);
      if (isEmptyObject(cartResult) == true) return -11;

      // 2. insert into Cart Product/Trail edge.
      const cp = new CartProduct();
      switch(model.type)
      {
        case 'PRODUCT':
          cp._from = 'Product/' + typekey;
          break;
        case 'TRAIL':
          cp._from = 'Trail/' + typekey;
          break;
      }
      
      cp._to = cartResult._id;

      const cpResult = await this.cartProductService.addOne(cp);
      if (isEmptyObject(cpResult) == true) return -12;

      return cartResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Cart): Promise<any> {
    try {
      const filters = {_key: model._key};
      const oldResult = await this.findOneBy(filters);
      if (isEmptyObject(oldResult) == true) return -10;

      return await this.cartRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Cart): Promise<any> {
    try {
      const cartFilters = {_key: model._key};
      const cartResult = await this.cartRepo.selectOneBy(cartFilters);
      if (isEmptyObject(cartResult) == true) return -10;

      const cpFilters = {_to: cartResult._id};
      const cpResult = await this.cartProductService.removeBy(cpFilters);
      if (isEmptyObject(cpResult) == true) return -10;
      if (cpResult.code != 200) return -10;
      if (cpResult == -10) return -10;

      return await this.cartRepo.deleteByKey(cartFilters._key);
    } catch (e) {
      throw e;
    }
  }
}