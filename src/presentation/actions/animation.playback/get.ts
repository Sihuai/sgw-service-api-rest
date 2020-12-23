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
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) { }
  async execute(token) : Promise<any>  {

    const userFilters = {email:token.email, isActive:true};
    const user = await this.userService.findOneBy(userFilters);

    const addrFilters = {_from: 'Users/' + user._key, isActive: true};
    return await this.animationPlaybackService.findAllBy(addrFilters);
  }
}