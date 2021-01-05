import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ShopService } from '../../../app/service/shop.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetShopAction, true)
@provide('action', true)
export class GetShopAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.ShopServiceImpl) private shopService: ShopService,
  ) { }
  async execute() : Promise<any>  {
    const filters = {isActive: true};
    return await this.shopService.findAllBy(filters);
  }
}