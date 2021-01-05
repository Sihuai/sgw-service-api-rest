import { ProductCategory } from '../../domain/models/product.category';
import { BaseService } from './base.service';

export interface ProductCategoryService extends BaseService<ProductCategory> {
    findAll() : Promise<ProductCategory[]>;
    findAllBy(filters) : Promise<ProductCategory[]>;
    findAllByKey(keys) : Promise<ProductCategory[]>;
    findOneBy(filters) : Promise<ProductCategory>;
    addOne(model: ProductCategory): Promise<any>;
    editOne(model: ProductCategory): Promise<any>;
    removeOne(model: ProductCategory): Promise<any>;
}