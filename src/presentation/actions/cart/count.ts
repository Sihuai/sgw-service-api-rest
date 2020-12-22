import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartItemService } from '../../../app/service/cart.item.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CountCartAction, true)
@provide('action', true)
export class CountCartAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartItemServiceImpl) public cartItemService: CartItemService,
  ) { }
  async execute(token) : Promise<any>  {
    const filters = {tag: token.email, isActive: true};
    return await this.cartItemService.countBy(filters);
  }
}