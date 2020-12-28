import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderItemService } from '../../../app/service/order.item.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetOrderDetailAction, true)
@provide('action', true)
export class GetOrderDetailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.OrderItemServiceImpl) private orderItemService: OrderItemService,
  ) { }
  async execute(orderKey: string) : Promise<any>  {
    if (isEmptyObject(orderKey) == true) return -1;          // Order key is empty!

    return await this.orderItemService.findAllBy(orderKey);
  }
}