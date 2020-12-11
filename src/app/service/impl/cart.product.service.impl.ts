import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartProduct } from '../../../domain/models/cart.product';
import { CartProductRepo } from '../../../infra/repository/cart.product.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartProductService } from '../cart.product.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartProductServiceImpl)
export class CartProductServiceImpl extends AbstractBaseService<CartProduct> implements CartProductService {
  constructor(
    @inject(IOC_TYPE.CartProductRepoImpl) private cartProductRepo: CartProductRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<CartProduct[]> {
    return await this.cartProductRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<CartProduct> {
    return await this.cartProductRepo.selectOneBy(filters);
  }

  async addOne(model: CartProduct): Promise<any> {
    try {
      return await this.cartProductRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: CartProduct): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.cartProductRepo.deleteByKey(result._key);
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

      return await this.cartProductRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}