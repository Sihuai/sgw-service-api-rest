import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartDetailService } from '../../../app/service/cart.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetCartDetailAction, true)
@provide('action', true)
export class GetCartDetailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartDetailServiceImpl) public cartDetailService: CartDetailService,
  ) { }
  async execute(user) : Promise<any>  {
    const filters = {tag: user._key, isActive: true};
    return await this.cartDetailService.findOneBy(filters);
  }
}