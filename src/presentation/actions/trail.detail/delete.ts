import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailDetailService } from '../../../app/service/trail.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { ITrailDetailDTO } from '../../../domain/dtos/i.trail.detail.dto';
import { TrailDetail } from '../../../domain/models/trail.detail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ITrailDetailDTO> {
  _key: string;
}

@provide(IOC_TYPE.DeleteTrailDetailAction, true)
@provide('action', true)
export class DeleteTrailDetailAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailDetailServiceImpl) public trailDetailService: TrailDetailService,
  ) {}
  execute(request: IRequest) {
    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    
    const model = new TrailDetail();
    model._key = request._key;

    return this.trailDetailService.removeOne(model);
  }
}
