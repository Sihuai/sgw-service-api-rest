import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartCartDetail } from '../../../domain/models/cart.cart.detail';
import { CartCartDetailRepo } from '../../../infra/repository/cart.cart.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartCartDetailService } from '../cart.cart.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartCartDetailServiceImpl)
export class CartCartDetailServiceImpl extends AbstractBaseService<CartCartDetail> implements CartCartDetailService {
  constructor(
    @inject(IOC_TYPE.CartCartDetailRepoImpl) private cartCartDetailRepo: CartCartDetailRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<CartCartDetail[]> {
    return await this.cartCartDetailRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<CartCartDetail> {
    return await this.cartCartDetailRepo.selectOneBy(filters);
  }

  async addOne(model: CartCartDetail): Promise<any> {
    try {
      return await this.cartCartDetailRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: CartCartDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == null) return -10;

      return await this.cartCartDetailRepo.deleteByKey(result._key);
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

      return await this.cartCartDetailRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}