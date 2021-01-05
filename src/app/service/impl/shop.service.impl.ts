import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Shop } from '../../../domain/models/shop';
import { ShopRepo } from '../../../infra/repository/shop.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { PageResult } from '../../../infra/utils/oct-orm/types/pageResult';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { ShopProductService } from '../shop.product.service';
import { ShopService } from '../shop.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ShopServiceImpl)
export class ShopServiceImpl extends AbstractBaseService<Shop> implements ShopService {
  constructor(
    @inject(IOC_TYPE.ShopRepoImpl) private shopRepo: ShopRepo,
    @inject(IOC_TYPE.ShopProductServiceImpl) private shopProductService: ShopProductService,
  ) {
    super();
  }

  async findAll() : Promise<Shop[]> {
    return await this.shopRepo.selectAll();
  }

  async page(filters) : Promise<PageResult> {
    return await this.shopRepo.page(filters);
  }

  async findAllBy(filters) : Promise<Shop> {
    return await this.shopRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<Shop[]> {
    return await this.shopRepo.selectAllByKey(key);
  }

  async pageByKey(key) : Promise<PageResult> {
    return await this.shopRepo.pageByKey(key);
  }

  async findOneBy(filters) : Promise<Shop> {
    return await this.shopRepo.selectOneBy(filters);
  }

  async addOne(model: Shop): Promise<any> {
    try {
      const filters = {name: model.name, isActive: true};
      const result = await this.shopRepo.selectOneBy(filters);
      if (isEmptyObject(result) == false) return -10;

      return await this.shopRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Shop): Promise<any> {
    try {
      const result = await this.shopRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      if (result[0].name != model.name) return -11;

      return await this.shopRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Shop): Promise<any> {
    try {
      const result = await this.shopRepo.selectAllByKey(model._key);
      if (isEmptyObject(result[0]) == true) return -10;

      // 1. Check Shop Product relation edge have record or not
      const filters = {_to: 'Shop/' + result[0]._key, isActive: true};
      const spResult = await this.shopProductService.findAllBy(filters);
      if (isEmptyObject(spResult) == false) return -11;
      
      // 2. Remove shop collection
      result[0].isActive = false;
      result[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.shopRepo.update(result[0]);
    } catch (e) {
      throw e;
    }
  }
}