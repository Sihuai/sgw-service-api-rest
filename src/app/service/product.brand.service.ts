import { ProductBrand } from '../../domain/models/product.brand';
import { BaseService } from './base.service';

export interface ProductBrandService extends BaseService<ProductBrand> {
    findAll() : Promise<ProductBrand[]>;
    findAllBy(filters) : Promise<ProductBrand[]>;
    findAllByKey(keys) : Promise<ProductBrand[]>;
    findOneBy(filters) : Promise<ProductBrand>;
    addOne(model: ProductBrand): Promise<any>;
    editOne(model: ProductBrand): Promise<any>;
    removeOne(model: ProductBrand): Promise<any>;
}