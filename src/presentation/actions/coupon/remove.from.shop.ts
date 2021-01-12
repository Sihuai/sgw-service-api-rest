import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { IOC_TYPE } from '../../../config/type';
import { IGenericEdgeDTO } from '../../../domain/dtos/i.generic.edge.dto';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.RemoveFromShopAction, true)
@provide('action', true)
export class RemoveFromShopAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {}
  execute(token, request: IGenericEdgeDTO) {

    if (isEmptyObject(request.fromkey) == true) return -1; // Coupon Key is empty!
    if (isEmptyObject(request.tokey) == true) return -2; // Shop Key is empty!
    
    const model = new GenericEdge();
    model._from = 'Coupon/' + request.fromkey;
    model._to = 'Shop/' + request.tokey;
    model.userLastUpdated = token.email;
    
    return this.genericEdgeService.removeOne(model);
  }
}
