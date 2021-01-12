import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Product } from '../../../domain/models/product';
import { ProductRepo } from '../../../infra/repository/product.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { ProductService } from '../product.service';
import { ShopProductService } from '../shop.product.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.ProductServiceImpl)
export class ProductServiceImpl extends AbstractBaseService<Product> implements ProductService {
  constructor(
    @inject(IOC_TYPE.ProductRepoImpl) private productRepo: ProductRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.ShopProductServiceImpl) private shopProductService: ShopProductService,
  ) {
    super();
  }

  async findAll() : Promise<Product[]> {
    return await this.productRepo.selectAll();
  }

  async findAllBy(filters) : Promise<Product[]> {
    return await this.productRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<Product[]> {
    return await this.productRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<Product> {
    return await this.productRepo.selectOneBy(filters);
  }

  async addOne(model: Product): Promise<any> {
    try {
      const filters = {sku:model.sku, isActive:true};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == false) return -10;

      return await this.productRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Product): Promise<any> {
    try {
      const result = await this.productRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      if (result[0].sku != model.sku) return -11;

      return await this.productRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Product): Promise<any> {
    try {
      const result = await this.productRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      const geFilters = {_from: 'Product/' + model._key, isActive: true};
      const geResult = await this.genericEdgeService.findAllBy(geFilters);
      if (isEmptyObject(geResult) == false) return -11; // Exist GenericEdge data!

      const spFilters = {_from: 'Product/' + model._key, isActive: true};
      const spResult = await this.shopProductService.findOneBy(spFilters);
      if (isEmptyObject(spResult) == false) return -12; // Exist ShopProduct data!
  
      result[0].isActive = false;
      result[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.productRepo.update(result[0]);
    } catch (e) {
      throw e;
    }
  }
}