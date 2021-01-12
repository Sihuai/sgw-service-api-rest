import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AnimationService } from '../../../app/service/animation.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetAnimationAction, true)
@provide('action', true)
export class GetAnimationAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.AnimationServiceImpl) private animationService: AnimationService,
  ) { }
  async execute() : Promise<any>  {
    const filters = {isActive: true};
    return await this.animationService.findAllBy(filters);
  }
}