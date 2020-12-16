import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartTrailProduct } from '../../../domain/models/cart.trail.product';
import { CartTrailProductRepo } from '../../../infra/repository/cart.trail.product.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartTrailProductService } from '../cart.trail.product.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartTrailProductServiceImpl)
export class CartTrailProductServiceImpl extends AbstractBaseService<CartTrailProduct> implements CartTrailProductService {
  constructor(
    @inject(IOC_TYPE.CartTrailProductRepoImpl) private cartTrailProductRepo: CartTrailProductRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<CartTrailProduct[]> {
    return await this.cartTrailProductRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<CartTrailProduct> {
    return await this.cartTrailProductRepo.selectOneBy(filters);
  }

  async addOne(model: CartTrailProduct): Promise<any> {
    try {
      return await this.cartTrailProductRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: CartTrailProduct): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.cartTrailProductRepo.deleteByKey(result._key);
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

      return await this.cartTrailProductRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}