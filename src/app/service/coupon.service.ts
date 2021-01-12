import { Coupon } from '../../domain/models/coupon';
import { BaseService } from './base.service';

export interface CouponService extends BaseService<Coupon> {
    findAll() : Promise<Coupon[]>;
    findAllBy(filters) : Promise<Coupon[]>;
    findAllByKey(keys) : Promise<Coupon[]>;
    findOneBy(filters) : Promise<Coupon>;
    addOne(model: Coupon): Promise<any>;
    editOne(model: Coupon): Promise<any>;
    removeOne(model: Coupon): Promise<any>;
}