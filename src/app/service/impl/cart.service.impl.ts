import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Cart } from '../../../domain/models/cart';
import { CartCartDetail } from '../../../domain/models/cart.cart.detail';
import { CartDetail } from '../../../domain/models/cart.detail';
import { CartTrailProduct } from '../../../domain/models/cart.trail.product';
import { CartRepo } from '../../../infra/repository/cart.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartService } from '../cart.service';
import { AbstractBaseService } from './base.service.impl';
import { CartCartDetailServiceImpl } from './cart.cart.detail.service.impl';
import { CartDetailServiceImpl } from './cart.detail.service.impl';
import { CartTrailProductServiceImpl } from './cart.trail.product.service.impl';

@provide(IOC_TYPE.CartServiceImpl)
export class CartServiceImpl extends AbstractBaseService<Cart> implements CartService {
  constructor(
    @inject(IOC_TYPE.CartRepoImpl) private cartRepo: CartRepo,
    @inject(IOC_TYPE.CartTrailProductServiceImpl) private cartTrailProductService: CartTrailProductServiceImpl,
    @inject(IOC_TYPE.CartDetailServiceImpl) private cartDetailService: CartDetailServiceImpl,
    @inject(IOC_TYPE.CartCartDetailServiceImpl) private cartCartDetailService: CartCartDetailServiceImpl,
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

  async addOne(typekey: string, cart: Cart, cartDetail: CartDetail): Promise<any> {
    try {
      // 1. Insert into cart collection.
      const cResult = await this.cartRepo.insert(cart);
      if (isEmptyObject(cResult) == true) return -11;

      // 2. insert into Cart Product/Trail edge.
      const cp = new CartTrailProduct();
      cp._to = cResult._id;
      switch(cart.type)
      {
        case 'PRODUCT':
          cp._from = 'Product/' + typekey;
          break;
        case 'TRAIL':
          cp._from = 'Trail/' + typekey;
          break;
      }
      
      const cpResult = await this.cartTrailProductService.addOne(cp);
      if (isEmptyObject(cpResult) == true) return -12;

      // 3. Insert into cart detail collection.
      const cdResult = await this.cartDetailService.addOne(cartDetail);
      if (isEmptyObject(cdResult) == true || cdResult == -11) return -12;

      // 4. Insert into cart & cart detail edge.
      const ccd = new CartCartDetail();
      ccd._from = cResult._id;
      ccd._to = cdResult._id;
      
      const ccdResult = await this.cartCartDetailService.addOne(cartDetail);
      if (isEmptyObject(ccdResult) == true) return -12;

      return cResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  // TODO: How to edit.
  async editOne(model: Cart): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.cartRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.cartRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Cart): Promise<any> {
    try {
      // 1. Get Cart CartDetail information
      const ccdFilters = {_from: model._key};
      const ccdResult = await this.cartCartDetailService.findOneBy(ccdFilters);
      if (isEmptyObject(ccdResult) == true) return -10;

      // 2. Remove Cart Trail Product edge
      const ctpFilters = {_to: model._id};
      const ctpResult = await this.cartTrailProductService.removeBy(ctpFilters);
      if (isEmptyObject(ctpResult) == true) return -10;
      if (ctpResult.code != 200) return -10;
      if (ctpResult == -10) return -10;

      // 3. Remove Cart CartDetail
      const cd = new CartDetail();
      cd._key = ccdResult._to;
      const cdResult = await this.cartDetailService.removeOne(cd);
      if (isEmptyObject(cdResult) == true) return -10;

      // 4. Remove Cart
      return await this.cartRepo.deleteByKey(model._key);
    } catch (e) {
      throw e;
    }
  }
}