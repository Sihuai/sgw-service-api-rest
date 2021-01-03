import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartItemOrderItem } from '../../../domain/models/cart.item.order.item';
import { CartItemOrderItemRepo } from '../../../infra/repository/cart.item.order.item.repo';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemOrderItemService } from '../cart.item.order.item.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartItemOrderItemServiceImpl)
export class CartItemOrderItemServiceImpl extends AbstractBaseService<CartItemOrderItem> implements CartItemOrderItemService {
  constructor(
    @inject(IOC_TYPE.CartItemOrderItemRepoImpl) private cartItemOrderItemRepo: CartItemOrderItemRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<CartItemOrderItem[]> {
    return await this.cartItemOrderItemRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<CartItemOrderItem> {
    return await this.cartItemOrderItemRepo.selectOneBy(filters);
  }

  async addOne(model: CartItemOrderItem): Promise<any> {
    try {
      return await this.cartItemOrderItemRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: CartItemOrderItem): Promise<any> {
    try {
      return await this.cartItemOrderItemRepo.update(model);
    } catch (e) {
      throw e;
    }
  }
}