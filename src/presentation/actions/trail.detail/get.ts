import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailDetailService } from '../../../app/service/trail.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetTrailDetailAction, true)
@provide('action', true)
export class GetTrailDetailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailDetailServiceImpl) private trailDetailService: TrailDetailService,
  ) { }
  async execute(trailKey: string) : Promise<any>  {
    if (isEmptyObject(trailKey) == true) return -4; // Trail Key is empty!
    
    const filters = {_from: 'Trail/' + trailKey, isActive: true};

    return await this.trailDetailService.findOneBy(filters);
  }
}