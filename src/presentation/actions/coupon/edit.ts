import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { CouponService } from '../../../app/service/coupon.service';
import { IOC_TYPE } from '../../../config/type';
import { ICouponDTO } from '../../../domain/dtos/i.coupon.dto';
import { Coupon } from '../../../domain/models/coupon';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.EditCouponAction, true)
@provide('action', true)
export class EditCouponAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CouponServiceImpl) private couponService: CouponService,
  ) {}
  async execute(token, request: ICouponDTO) : Promise<any> {

    if (isEmptyObject(request.type) == true) return -1; // Type is empty!
    if (isEmptyObject(request.name) == true) return -2; // Name is empty!
    if (isEmptyObject(request.description) == true) return -3; // Description is empty!
    if (request.maxLimit < 0) return -4; // Max Limit less than zero!
    if (isEmptyObject(request.expire) == true) return -5; // Expire is empty!
    if (isEmptyObject(request.option) == true) return -6; // Option is empty!

    if (isEmptyObject(request._key) == true) return -7; // Coupon key is empty!

    const model = new Coupon();
    model.type = request.type;
    model.name = request.name;
    model.description = request.description;
    model.hasMaxLimit = request.hasMaxLimit;
    model.maxLimit = request.maxLimit;
    model.expire = request.expire;
    model.option = request.option;
    model._key = request._key;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;
    
    return await this.couponService.editOne(model);
  }
}