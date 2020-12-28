import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderService } from '../../../app/service/order.service';
import { IOC_TYPE } from '../../../config/type';
import { Order } from '../../../domain/models/order';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteOrderAction, true)
@provide('action', true)
export class DeleteOrderAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.OrderServiceImpl) private orderService: OrderService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Order();
    model._key = key;
    model.userLastUpdated = token.email;
    
    return this.orderService.removeOne(model);
  }
}
