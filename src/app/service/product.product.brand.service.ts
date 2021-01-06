import { ProductProductBrand } from '../../domain/models/product.product.brand';
import { BaseService } from './base.service';

export interface ProductProductBrandService extends BaseService<ProductProductBrand> {
    findAllBy(filters) : Promise<ProductProductBrand[]>;
    findOneBy(filters) : Promise<ProductProductBrand>;
    addOne(model: ProductProductBrand): Promise<any>;
    removeOne(model: ProductProductBrand): Promise<any>;
}