import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartItemDetailService } from '../../../app/service/cart.item.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetCartDetailAction, true)
@provide('action', true)
export class GetCartDetailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CartItemDetailServiceImpl) private cartItemDetailService: CartItemDetailService,
  ) { }
  async execute(cartItemKey: string) : Promise<any>  {
    if (isEmptyObject(cartItemKey) == true) return -1;          // Cart Item key is empty!

    return await this.cartItemDetailService.findOneBy(cartItemKey);
  }
}