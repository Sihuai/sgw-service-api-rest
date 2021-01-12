import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Coupon } from '../../../domain/models/coupon';
import { CouponRepo } from '../../../infra/repository/coupon.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CouponService } from '../coupon.service';
import { GenericEdgeService } from '../generic.edge.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CouponServiceImpl)
export class CouponServiceImpl extends AbstractBaseService<Coupon> implements CouponService {
  constructor(
    @inject(IOC_TYPE.CouponRepoImpl) private couponRepo: CouponRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAll() : Promise<Coupon[]> {
    return await this.couponRepo.selectAll();
  }

  async findAllBy(filters) : Promise<Coupon[]> {
    return await this.couponRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<Coupon[]> {
    return await this.couponRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<Coupon> {
    return await this.couponRepo.selectOneBy(filters);
  }

  async addOne(model: Coupon): Promise<any> {
    try {
      const filters = {name:model.name, isActive:true};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == false) return -10;

      return await this.couponRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Coupon): Promise<any> {
    try {
      const result = await this.couponRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      if (result[0].name != model.name) return -11;

      return await this.couponRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Coupon): Promise<any> {
    try {
      const cResult = await this.couponRepo.selectAllByKey(model._key);
      if (isEmptyObject(cResult) == true) return -10;

      const geFilters = {_from: 'Coupon/' + model._key, isActive: true};
      const geResult = await this.genericEdgeService.findAllBy(geFilters);
      if (isEmptyObject(geResult) == false) return -11; // Exist GenericEdge data!
  
      cResult[0].isActive = false;
      cResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      cResult[0].userLastUpdated = model.userLastUpdated;

      return await this.couponRepo.update(cResult[0]);
    } catch (e) {
      throw e;
    }
  }
}