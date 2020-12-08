import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailService } from '../../../app/service/trail.service';
import { IOC_TYPE } from '../../../config/type';
import { ITrailDTO, Trail } from '../../../domain/models/trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ITrailDTO> {
  _key: string;
}

@provide(IOC_TYPE.DeleteTrailAction, true)
@provide('action', true)
export class DeleteTrailAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailServiceImpl) public trailService: TrailService,
  ) {}
  execute(request: IRequest) {
    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    
    const model = new Trail();
    model._key = request._key;

    return this.trailService.removeOne(model);
  }
}
