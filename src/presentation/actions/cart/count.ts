import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartService } from '../../../app/service/cart.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CountCartAction, true)
@provide('action', true)
export class CountCartAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartServiceImpl) public cartService: CartService,
  ) { }
  async execute(user) : Promise<any>  {
    const filters = {tag: user._key, isActive: true};
    return await this.cartService.countBy(filters);
  }
}