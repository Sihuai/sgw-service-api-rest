import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CouponService } from '../../../app/service/coupon.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetCouponAction, true)
@provide('action', true)
export class GetCouponAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CouponServiceImpl) private couponService: CouponService,
  ) { }
  async execute() : Promise<any>  {

    const filters = {isActive: true};
    return await this.couponService.findAllBy(filters);
  }
}