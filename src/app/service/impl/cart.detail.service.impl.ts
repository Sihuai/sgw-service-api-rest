import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartDetail } from '../../../domain/models/cart.detail';
import { CartDetailRepo } from '../../../infra/repository/cart.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartDetailService } from '../cart.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartDetailServiceImpl)
export class CartDetailServiceImpl extends AbstractBaseService<CartDetail> implements CartDetailService {
  constructor(
    @inject(IOC_TYPE.CartDetailRepoImpl) private cartDetailRepo: CartDetailRepo,
    // @inject(IOC_TYPE.CartDetailProductServiceImpl) private cartProductService: CartDetailProductServiceImpl,
  ) {
    super();
  }

  async findAll() : Promise<CartDetail[]> {
    return await this.cartDetailRepo.selectAll();
  }

  async findAllBy(filters) : Promise<CartDetail> {
    return await this.cartDetailRepo.selectAllBy(filters);
  }

  async findAllByKey(filters) : Promise<any> {
    return await this.cartDetailRepo.selectAllByKey(filters);
  }

  async findOneBy(filters) : Promise<CartDetail> {
    return await this.cartDetailRepo.selectOneBy(filters);
  }

  async countBy(filters) : Promise<any> {
    return await this.cartDetailRepo.countBy(filters);
  }

  async addOne(model: CartDetail): Promise<any> {
    try {
      const cartResult = await this.cartDetailRepo.insert(model);
      if (isEmptyObject(cartResult) == true) return -11;

      return cartResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: CartDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.cartDetailRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.cartDetailRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: CartDetail): Promise<any> {
    try {
      const cartFilters = {_key: model._key};
      const cartResult = await this.cartDetailRepo.selectOneBy(cartFilters);
      if (isEmptyObject(cartResult) == true) return -10;

      // const cpFilters = {_to: cartResult._id};
      // const cpResult = await this.cartProductService.removeBy(cpFilters);
      // if (isEmptyObject(cpResult) == true) return -10;
      // if (cpResult.code != 200) return -10;
      // if (cpResult == -10) return -10;

      return await this.cartDetailRepo.deleteByKey(cartFilters._key);
    } catch (e) {
      throw e;
    }
  }
}