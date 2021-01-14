import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
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
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) { }
  async execute(trailKey: string) : Promise<any>  {
    if (isEmptyObject(trailKey) == true) return -1; // Trail Key is empty!
    
    const filters = {_to: 'Trail/' + trailKey, isActive: true};
    const result = await this.genericEdgeService.findOneBy(filters);
    if (isEmptyObject(result) == true) return -2; // No GenericEdge data!

    return await this.trailDetailService.findAllByKey(result._from);
  }
}