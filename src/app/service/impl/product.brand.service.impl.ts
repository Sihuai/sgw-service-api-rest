import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ProductBrand } from '../../../domain/models/product.brand';
import { ProductBrandRepo } from '../../../infra/repository/product.brand.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { ProductBrandService } from '../product.brand.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ProductBrandServiceImpl)
export class ProductBrandServiceImpl extends AbstractBaseService<ProductBrand> implements ProductBrandService {
  constructor(
    @inject(IOC_TYPE.ProductBrandRepoImpl) private productbrandRepo: ProductBrandRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAll() : Promise<ProductBrand[]> {
    return await this.productbrandRepo.selectAll();
  }

  async findAllBy(filters) : Promise<ProductBrand[]> {
    return await this.productbrandRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<ProductBrand[]> {
    return await this.productbrandRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<ProductBrand> {
    return await this.productbrandRepo.selectOneBy(filters);
  }

  async addOne(model: ProductBrand): Promise<any> {
    try {
      const filters = {name:model.name, isActive:true};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == false) return -10;

      const maxResult = await this.productbrandRepo.selectMax();
      if (isEmptyObject(maxResult) == false) {
        model.sequence = maxResult.sequence + 1;
      }

      return await this.productbrandRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: ProductBrand): Promise<any> {
    try {
      const result = await this.productbrandRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      result[0].name = model.name;
      result[0].description = model.description;
      result[0].datetimeLastEdited = model.datetimeLastEdited;
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.productbrandRepo.update(result[0]);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: ProductBrand): Promise<any> {
    try {
      const pcResult = await this.productbrandRepo.selectAllByKey(model._key);
      if (isEmptyObject(pcResult) == true) return -10;

      const ppcFilters = {_to: 'ProductBrand/' + model._key, isActive: true};
      const ppcResult = await this.genericEdgeService.findOneBy(ppcFilters);
      if (isEmptyObject(ppcResult) == false) return -11;
  
      pcResult[0].isActive = false;
      pcResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      pcResult[0].userLastUpdated = model.userLastUpdated;

      return await this.productbrandRepo.update(pcResult[0]);
    } catch (e) {
      throw e;
    }
  }
}