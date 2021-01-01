import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailAnimationPlaybackService } from '../../../app/service/trail.animation.playback.service';
import { IOC_TYPE } from '../../../config/type';
import { ITrailAnimationPlaybackDTO } from '../../../domain/dtos/i.trail.animation.playback.dto';
import { TrailAnimationPlayback } from '../../../domain/models/trail.animation.playback';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteTrailAnimationPlaybackAction, true)
@provide('action', true)
export class DeleteTrailAnimationPlaybackAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailAnimationPlaybackServiceImpl) private trailAnimationPlaybackService: TrailAnimationPlaybackService,
  ) {}
  execute(token, request: ITrailAnimationPlaybackDTO) {

    if (isEmptyObject(request.animationplaybackkey) == true) return -1; // AnimationPlayback Key is empty!
    if (isEmptyObject(request.trailkey) == true) return -2; // Trail Key is empty!
    
    const model = new TrailAnimationPlayback();
    model._from = 'AnimationPlayback/' + request.animationplaybackkey;
    model._to = 'Trail/' + request.trailkey;
    model.userLastUpdated = token.email;
    
    return this.trailAnimationPlaybackService.removeOne(model);
  }
}
