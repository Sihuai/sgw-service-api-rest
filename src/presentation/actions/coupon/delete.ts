import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CouponService } from '../../../app/service/coupon.service';
import { IOC_TYPE } from '../../../config/type';
import { Coupon } from '../../../domain/models/coupon';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteCouponAction, true)
@provide('action', true)
export class DeleteCouponAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.CouponServiceImpl) private couponService: CouponService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Coupon();
    model._key = key;
    model.userLastUpdated = token.email;

    return this.couponService.removeOne(model);
  }
}
