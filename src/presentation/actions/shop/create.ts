import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopService } from '../../../app/service/shop.service';
import { IOC_TYPE } from '../../../config/type';
import { IShopDTO } from '../../../domain/dtos/i.shop.dto';
import { Shop } from '../../../domain/models/shop';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.CreateShopAction, true)
@provide('action', true)
export class CreateShopAction implements IAction {
  payloadExample = ` `;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopServiceImpl) private shopService: ShopService,
  ) {}
  async execute(token, request: IShopDTO) : Promise<any> {

    if (isEmptyObject(request.name) == true) return -1; // Name is empty!
    if (isEmptyObject(request.isLocked) == true) return -2; // Is locked is empty!
    if (isEmptyObject(request.posters) == true) return -3; // Posters is empty!

    for (const poster of request.posters) {
      if (isEmptyObject(poster.type) == true) return -4; // Posters type is empty!
      if (isEmptyObject(poster.tag) == true) return -5; // Posters tag is empty!
      if (isEmptyObject(poster.orientation) == true) return -6; // Posters orientation is empty!
      if (isEmptyObject(poster.format) == true) return -7; // Posters format is empty!
      if (isEmptyObject(poster.uri) == true) return -8; // Posters uri is empty!
    }
    
    const model = new Shop();
    model.name = request.name;
    model.isLocked = request.isLocked;
    model.posters = request.posters;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.shopService.addOne(model);
  }
}