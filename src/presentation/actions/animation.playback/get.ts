import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AnimationPlaybackService } from '../../../app/service/animation.playback.service';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetAnimationPlaybackAction, true)
@provide('action', true)
export class GetAnimationPlaybackAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.AnimationPlaybackServiceImpl) private animationPlaybackService: AnimationPlaybackService,
  ) { }
  async execute() : Promise<any>  {
    const filters = {isActive: true};
    return await this.animationPlaybackService.findAllBy(filters);
  }
}