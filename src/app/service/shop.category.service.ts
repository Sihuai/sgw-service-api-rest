import { ShopCategory } from '../../domain/models/shop.category';
import { BaseService } from './base.service';

export interface ShopCategoryService extends BaseService<ShopCategory> {
    findAllBy(filters) : Promise<ShopCategory[]>;
}