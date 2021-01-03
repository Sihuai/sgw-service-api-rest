import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OrderItemUserAnimationPlaybackService } from '../../../app/service/order.item.user.animation.playback.service';
import { UserAnimationPlaybackService } from '../../../app/service/user.animation.playback.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.MyAnimationPlaybackAction, true)
@provide('action', true)
export class MyAnimationPlaybackAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserAnimationPlaybackServiceImpl) private userAnimationPlaybackService: UserAnimationPlaybackService,
    @inject(IOC_TYPE.OrderItemUserAnimationPlaybackServiceImpl) private orderItemUserAnimationPlaybackService: OrderItemUserAnimationPlaybackService,
  ) { }
  async execute(key: string) : Promise<any>  {
    const filters = {_to: 'OrderItem/' + key, isActive: true};
    const result = await this.orderItemUserAnimationPlaybackService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -1;

    return await this.userAnimationPlaybackService.findAllByKey(result._from);
  }
}