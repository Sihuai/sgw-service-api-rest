import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AnimationService } from '../../../app/service/animation.service';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetPitStopFromShopAction, true)
@provide('action', true)
export class GetPitStopFromShopAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.AnimationServiceImpl) private animationService: AnimationService,
  ) { }
  async execute(key: string) : Promise<any>  {
    if (isEmptyObject(key) == true) return -1; // Key is empty!

    const filters = {_from: 'Shop/' + key, isActive: true};
    const result = await this.genericEdgeService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -2; // No GenericEdge data!

    const aResult = await this.animationService.findAllByKey(result._to);

    // Set is next to true represent shop
    const animation = aResult[0];
    animation.buttons.forEach((button) => {
      if (button.sequence == result.sequence) {
        button.isNext = true;
        animation.nextPitStop.name = button.tag;
        return false;
      }
    })

    return animation;
  }
}