import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { IOC_TYPE } from '../../../config/type';
import { IGenericEdgeDTO } from '../../../domain/dtos/i.generic.edge.dto';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateTrailAnimationAction, true)
@provide('action', true)
export class CreateTrailAnimationAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {}
  async execute(token, request: IGenericEdgeDTO) : Promise<any> {

    if (isEmptyObject(request.fromkey) == true) return -1; // Animation Key is empty!
    if (isEmptyObject(request.tokey) == true) return -2; // Trail Key is empty!

    const model = new GenericEdge();
    model._from = 'Animation/' + request.fromkey;
    model._to = 'Trail/' + request.tokey;
    model.tag = 'Animation';
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.genericEdgeService.addOne(model);
  }
}