import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderService } from '../../../app/service/order.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.PagingOrderAction, true)
@provide('action', true)
export class PagingOrderAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.OrderServiceImpl) private orderService: OrderService,
  ) { }
  async execute(token, index: number) : Promise<any>  {

    const filters = {tag: token.email, isActive: true};

    return await this.orderService.page(filters, index, 10);
  }
}