import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { IOC_TYPE } from '../../../config/type';
import { IGenericEdgeDTO } from '../../../domain/dtos/i.generic.edge.dto';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.AddProductToCategoryAction, true)
@provide('action', true)
export class AddProductToCategoryAction implements IAction {
  payloadExample = `
  {
    "productkey": "123456",
    "productcategorykey": "654321"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {}
  async execute(token, request: IGenericEdgeDTO) : Promise<any> {

    if (isEmptyObject(request.fromkey) == true) return -1; // Product Key is empty!
    if (isEmptyObject(request.tokey) == true) return -2; // Product Category Key is empty!

    const model = new GenericEdge();
    model._from = 'Product/' + request.fromkey;
    model._to = 'ProductCategory/' + request.tokey;
    model.tag = 'ProductCategory';
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.genericEdgeService.addOne(model);
  }
}