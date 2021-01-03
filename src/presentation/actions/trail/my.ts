import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderItemService } from '../../../app/service/order.item.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.MyTrailAction, true)
@provide('action', true)
export class MyTrailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.OrderItemServiceImpl) private orderItemService: OrderItemService,
  ) { }
  async execute(token) : Promise<any>  {
    const filters = {tag: token.email, type: 'TRAIL', status: 'PAID', isActive: true};
    return await this.orderItemService.findAll(filters);
  }
}