import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { IOC_TYPE } from '../../../config/type';
import { IGenericEdgeDTO } from '../../../domain/dtos/i.generic.edge.dto';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IGenericEdgeDTO> {
  sequence: number;
}

@provide(IOC_TYPE.AddToPitStopAction, true)
@provide('action', true)
export class AddToPitStopAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request.fromkey) == true) return -1; // Shop Key is empty!
    if (isEmptyObject(request.tokey) == true) return -2; // Pit Stop Key is empty!
    if (request.sequence < 0) return -3; // Pit Stop Sequence less than zero!

    const model = new GenericEdge();
    model._from = 'Shop/' + request.fromkey;
    model._to = 'Animation/' + request.tokey;
    model.sequence = request.sequence;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.genericEdgeService.addOne(model);
  }
}