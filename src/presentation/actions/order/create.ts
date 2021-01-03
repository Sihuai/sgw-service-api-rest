import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderService } from '../../../app/service/order.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateOrderAction, true)
@provide('action', true)
export class CreateOrderAction implements IAction {
  payloadExample = `  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.OrderServiceImpl) private orderService: OrderService,
  ) {}
  async execute(token, addressKey: string) : Promise<any> {

    // if (isEmptyObject(addressKey) == true) return -1;          // Address key is empty!
    
    const filters = {tag: token.email, isActive: true};
    return await this.orderService.addOne(token.email, addressKey, filters);
  }
}