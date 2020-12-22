import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartItemDetail } from '../../../domain/models/cart.item.detail';
import { CartItemDetailRepo } from '../../../infra/repository/cart.item.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemDetailService } from '../cart.item.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartDetailServiceImpl)
export class CartDetailServiceImpl extends AbstractBaseService<CartItemDetail> implements CartItemDetailService {
  constructor(
    @inject(IOC_TYPE.CartItemDetailRepoImpl) private cartItemDetailRepo: CartItemDetailRepo,
    // @inject(IOC_TYPE.CartDetailProductServiceImpl) private cartProductService: CartDetailProductServiceImpl,
  ) {
    super();
  }

  async findAll() : Promise<CartItemDetail[]> {
    return await this.cartItemDetailRepo.selectAll();
  }

  async findAllBy(filters) : Promise<CartItemDetail> {
    return await this.cartItemDetailRepo.selectAllBy(filters);
  }

  async findAllByKey(filters) : Promise<any> {
    return await this.cartItemDetailRepo.selectAllByKey(filters);
  }

  async findOneBy(filters) : Promise<CartItemDetail> {
    return await this.cartItemDetailRepo.selectOneBy(filters);
  }

  async countBy(filters) : Promise<any> {
    return await this.cartItemDetailRepo.countBy(filters);
  }

  async addOne(model: CartItemDetail): Promise<any> {
    try {
      const cartResult = await this.cartItemDetailRepo.insert(model);
      if (isEmptyObject(cartResult) == true) return -11;

      return cartResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: CartItemDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.cartItemDetailRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.cartItemDetailRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: CartItemDetail): Promise<any> {
    try {
      const cartFilters = {_key: model._key};
      const cartResult = await this.cartItemDetailRepo.selectOneBy(cartFilters);
      if (isEmptyObject(cartResult) == true) return -10;

      // const cpFilters = {_to: cartResult._id};
      // const cpResult = await this.cartProductService.removeBy(cpFilters);
      // if (isEmptyObject(cpResult) == true) return -10;
      // if (cpResult.code != 200) return -10;
      // if (cpResult == -10) return -10;

      return await this.cartItemDetailRepo.deleteByKey(cartFilters._key);
    } catch (e) {
      throw e;
    }
  }
}