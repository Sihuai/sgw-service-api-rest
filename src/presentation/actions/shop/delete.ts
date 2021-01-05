import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopService } from '../../../app/service/shop.service';
import { IOC_TYPE } from '../../../config/type';
import { Shop } from '../../../domain/models/shop';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteShopAction, true)
@provide('action', true)
export class DeleteShopAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopServiceImpl) private shopService: ShopService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Shop();
    model._key = key;
    model.userLastUpdated = token.email;
    
    return this.shopService.removeOne(model);
  }
}
