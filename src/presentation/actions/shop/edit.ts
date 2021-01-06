import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { ShopService } from '../../../app/service/shop.service';
import { IOC_TYPE } from '../../../config/type';
import { IShopDTO } from '../../../domain/dtos/i.shop.dto';
import { Shop } from '../../../domain/models/shop';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.EditShopAction, true)
@provide('action', true)
export class EditShopAction implements IAction {
  payloadExample = ` `;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopServiceImpl) private shopService: ShopService,
  ) {}
  async execute(token, request: IShopDTO) : Promise<any> {

    if (isEmptyObject(request.name) == true) return -1; // Name is empty!
    if (isEmptyObject(request.type) == true) return -2; // Type is empty!
    if (isEmptyObject(request.isLocked) == true) return -3; // Is locked is empty!
    if (isEmptyObject(request.posters) == true) return -4; // Posters is empty!

    for (const poster of request.posters) {
      if (isEmptyObject(poster.type) == true) return -5; // Posters type is empty!
      if (isEmptyObject(poster.tag) == true) return -6; // Posters tag is empty!
      if (isEmptyObject(poster.orientation) == true) return -7; // Posters orientation is empty!
      if (isEmptyObject(poster.format) == true) return -8; // Posters format is empty!
      if (isEmptyObject(poster.uri) == true) return -9; // Posters uri is empty!
    }

    if (isEmptyObject(request._key) == true) return -100;      // Key is empty!
    
    const model = new Shop();
    model.name = request.name;
    model.isLocked = request.isLocked;
    model.posters = request.posters;
    model._key = request._key;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;

    return await this.shopService.editOne(model);
  }
}