import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ProductCategoryService } from '../../../app/service/product.category.service';
import { IOC_TYPE } from '../../../config/type';
import { IProductCategoryDTO } from '../../../domain/dtos/i.product.category.dto';
import { ProductCategory } from '../../../domain/models/product.category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateProductCategoryAction, true)
@provide('action', true)
export class CreateProductCategoryAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ProductCategoryServiceImpl) private productcategoryService: ProductCategoryService,
  ) {}
  async execute(token, request: IProductCategoryDTO) : Promise<any> {

    if (request.sequence <= 0) return -1; // Sequence is less than zero!
    if (isEmptyObject(request.name) == true) return -2; // Name is empty!
    if (isEmptyObject(request.description) == true) return -3; // Description is empty!

    const model = new ProductCategory();
    model.sequence = request.sequence;
    model.name = request.name;
    model.description = request.description;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.productcategoryService.addOne(model);
  }
}