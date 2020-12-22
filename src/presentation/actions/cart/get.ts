import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartItemService } from '../../../app/service/cart.item.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetCartAction, true)
@provide('action', true)
export class GetCartAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartItemServiceImpl) private cartItemService: CartItemService,
  ) { }
  async execute(token) : Promise<any>  {
    const filters = {tag: token.email, isActive: true};
    return await this.cartItemService.findAllBy(filters);
  }
}