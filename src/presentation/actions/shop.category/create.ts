import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopCategoryService } from '../../../app/service/shop.category.service';
import { IOC_TYPE } from '../../../config/type';
import { IShopCategoryDTO } from '../../../domain/dtos/i.shop.category.dto';
import { ShopTypes } from '../../../domain/enums/shop.types';
import { ShopCategory } from '../../../domain/models/shop.category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateShopCategoryAction, true)
@provide('action', true)
export class CreateShopCategoryAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopCategoryServiceImpl) private shopcategoryService: ShopCategoryService,
  ) {}
  async execute(token, request: IShopCategoryDTO) : Promise<any> {

    if (isEmptyObject(request.type) == true) return -1; // Type is empty!

    switch (request.type) {
      case ShopTypes.GMALL:
        for (let category of request.categories) {
          if (category.sequence <= 0) return -2; // Category Sequence less than zero!
          if (isEmptyObject(category.name) == true) return -3; // Category Name is empty!
          if (isEmptyObject(category.color) == true) return -4; // Category Color is empty!
        }
        break;
      case ShopTypes.TRAILSSHOPS:
        for (let trail of request.trails) {
          if (trail.sequence <= 0) return -5; // Trail Sequence less than zero!
          if (isEmptyObject(trail.name) == true) return -6; // Trail Name is empty!
          if (isEmptyObject(trail.color) == true) return -7; // Trail Color is empty!
        }
        break;
      default:
        return -8; // Type isnot in G-MALL/TRAILS-SHOPS!
    }

    const model = new ShopCategory();
    model.type = request.type;
    model.categories = request.categories;
    model.trails = request.trails;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.shopcategoryService.addOne(model);
  }
}