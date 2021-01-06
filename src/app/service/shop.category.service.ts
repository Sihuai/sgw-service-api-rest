import { ShopCategory } from '../../domain/models/shop.category';
import { BaseService } from './base.service';

export interface ShopCategoryService extends BaseService<ShopCategory> {
    findAll() : Promise<ShopCategory[]>;
    findAllBy(filters) : Promise<ShopCategory[]>;
    findAllByKey(keys) : Promise<ShopCategory[]>;
    findOneBy(filters) : Promise<ShopCategory>;
    addOne(model: ShopCategory): Promise<any>;
    editOne(model: ShopCategory): Promise<any>;
    removeOne(model: ShopCategory): Promise<any>;
}