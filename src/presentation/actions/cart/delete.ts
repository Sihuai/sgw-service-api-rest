import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartService } from '../../../app/service/cart.service';
import { IOC_TYPE } from '../../../config/type';
import { Cart } from '../../../domain/models/cart';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteCartAction, true)
@provide('action', true)
export class DeleteCartAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.CartServiceImpl) public cartService: CartService,
  ) {}
  execute(key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Cart();
    model._key = key;

    return this.cartService.removeOne(model);
  }
}
