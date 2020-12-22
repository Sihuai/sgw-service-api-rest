import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailService } from '../../../app/service/trail.service';
import { IOC_TYPE } from '../../../config/type';
import { Trail } from '../../../domain/models/trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteTrailAction, true)
@provide('action', true)
export class DeleteTrailAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailServiceImpl) private trailService: TrailService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Trail();
    model._key = key;
    model.userLastUpdated = token.email;
    
    return this.trailService.removeOne(model);
  }
}
