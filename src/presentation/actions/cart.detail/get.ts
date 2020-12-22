import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartItemDetailService } from '../../../app/service/cart.item.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetCartDetailAction, true)
@provide('action', true)
export class GetCartDetailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartDetailServiceImpl) public cartItemDetailService: CartItemDetailService,
  ) { }
  async execute(user) : Promise<any>  {
    const filters = {tag: user._key, isActive: true};
    return await this.cartItemDetailService.findOneBy(filters);
  }
}