import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CartItemService } from '../../../app/service/cart.item.service';
import { IOC_TYPE } from '../../../config/type';
import { CartItem } from '../../../domain/models/cart.item';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteCartAction, true)
@provide('action', true)
export class DeleteCartAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.CartItemServiceImpl) public cartItemService: CartItemService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new CartItem();
    model._key = key;
    model.userLastUpdated = token.email;
    
    return this.cartItemService.removeOne(model);
  }
}
