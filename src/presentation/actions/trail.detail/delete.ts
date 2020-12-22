import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailDetailService } from '../../../app/service/trail.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { TrailDetail } from '../../../domain/models/trail.detail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteTrailDetailAction, true)
@provide('action', true)
export class DeleteTrailDetailAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailDetailServiceImpl) private trailDetailService: TrailDetailService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new TrailDetail();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.trailDetailService.removeOne(model);
  }
}
