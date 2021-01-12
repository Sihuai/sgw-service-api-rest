import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { IOC_TYPE } from '../../../config/type';
import { IGenericEdgeDTO } from '../../../domain/dtos/i.generic.edge.dto';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.AddToShopAction, true)
@provide('action', true)
export class AddToShopAction implements IAction {
  payloadExample = ` `;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {}
  async execute(token, request: IGenericEdgeDTO) : Promise<any> {

    if (isEmptyObject(request.fromkey) == true) return -1; // Coupon Key is empty!
    if (isEmptyObject(request.tokey) == true) return -2; // Shop Key is empty!

    const model = new GenericEdge();
    model._from = 'Coupon/' + request.fromkey;
    model._to = 'Shop/' + request.tokey;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.genericEdgeService.addOne(model);
  }
}