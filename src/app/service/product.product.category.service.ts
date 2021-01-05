import { ProductProductCategory } from '../../domain/models/product.product.category';
import { BaseService } from './base.service';

export interface ProductProductCategoryService extends BaseService<ProductProductCategory> {
    findAllBy(filters) : Promise<ProductProductCategory[]>;
    findOneBy(filters) : Promise<ProductProductCategory>;
    addOne(model: ProductProductCategory): Promise<any>;
    removeOne(model: ProductProductCategory): Promise<any>;
}