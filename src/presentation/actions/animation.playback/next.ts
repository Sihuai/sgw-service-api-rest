import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { UserAnimationPlaybackService } from '../../../app/service/user.animation.playback.service';
import { IOC_TYPE } from '../../../config/type';
import { IAnimationPlaybackDTO } from '../../../domain/dtos/i.animation.playback.dto';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IAnimationPlaybackDTO> {
  orderitemkey: string;
  next: number;
}

@provide(IOC_TYPE.NextAnimationPlaybackAction, true)
@provide('action', true)
export class NextAnimationPlaybackAction implements IAction {
  payloadExample = ` `;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserAnimationPlaybackServiceImpl) private userAnimationPlaybackService: UserAnimationPlaybackService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {
    if (isEmptyObject(request.orderitemkey) == true) return -1; // Order Item Key is empty!
    if (request.next <= 0) return -2;                           // Next less than zero!

    return await this.userAnimationPlaybackService.editOne(token.email, request.orderitemkey, request.next);
  }
}