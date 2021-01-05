import { ShopProduct } from '../../domain/models/shop.product';
import { BaseService } from './base.service';

export interface ShopProductService extends BaseService<ShopProduct> {
    findAllBy(filters) : Promise<ShopProduct[]>;
    findOneBy(filters) : Promise<ShopProduct>;
    addOne(model: ShopProduct): Promise<any>;
    removeOne(model: ShopProduct): Promise<any>;
}