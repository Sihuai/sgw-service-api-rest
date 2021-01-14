import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderItemUserAnimationService } from '../../../app/service/order.item.user.animation.service';
import { UserAnimationService } from '../../../app/service/user.animation.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.MyAnimationAction, true)
@provide('action', true)
export class MyAnimationAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserAnimationServiceImpl) private userAnimationService: UserAnimationService,
    @inject(IOC_TYPE.OrderItemUserAnimationServiceImpl) private orderItemUserAnimationService: OrderItemUserAnimationService,
  ) { }
  async execute(key: string) : Promise<any>  {
    const filters = {_to: 'OrderItem/' + key, isActive: true};
    const result = await this.orderItemUserAnimationService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -1;

    return await this.userAnimationService.findAllByKey(result._from);
  }
}