import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartItemCartItemDetail } from '../../../domain/models/cart.item.cart.item.detail';
import { CartItemCartItemDetailRepo } from '../../../infra/repository/cart.item.cart.item.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemCartItemDetailService } from '../cart.item.cart.item.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartItemCartItemDetailServiceImpl)
export class CartItemCartItemDetailServiceImpl extends AbstractBaseService<CartItemCartItemDetail> implements CartItemCartItemDetailService {
  constructor(
    @inject(IOC_TYPE.CartItemCartItemDetailRepoImpl) private cartItemCartItemDetailRepo: CartItemCartItemDetailRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<CartItemCartItemDetail[]> {
    return await this.cartItemCartItemDetailRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<CartItemCartItemDetail> {
    return await this.cartItemCartItemDetailRepo.selectOneBy(filters);
  }

  async addOne(model: CartItemCartItemDetail): Promise<any> {
    try {
      return await this.cartItemCartItemDetailRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: CartItemCartItemDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.cartItemCartItemDetailRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }

  async removeBy(filters): Promise<any> {
    try {
      const result = await this.findAllBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      const keys: Array<string> = [];
      for (let data of result) {
        keys.push(data._key);
      }

      return await this.cartItemCartItemDetailRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}