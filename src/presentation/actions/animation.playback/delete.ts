import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AnimationPlaybackService } from '../../../app/service/animation.playback.service';
import { IOC_TYPE } from '../../../config/type';
import { AnimationPlayback } from '../../../domain/models/animation.playback';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteAnimationPlaybackAction, true)
@provide('action', true)
export class DeleteAnimationPlaybackAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.AnimationPlaybackServiceImpl) private animationPlaybackService: AnimationPlaybackService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new AnimationPlayback();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.animationPlaybackService.removeOne(model);
  }
}
