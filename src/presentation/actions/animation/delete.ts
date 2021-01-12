import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AnimationService } from '../../../app/service/animation.service';
import { IOC_TYPE } from '../../../config/type';
import { Animation } from '../../../domain/models/animation';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteAnimationAction, true)
@provide('action', true)
export class DeleteAnimationAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.AnimationServiceImpl) private animationService: AnimationService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Animation();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.animationService.removeOne(model);
  }
}
