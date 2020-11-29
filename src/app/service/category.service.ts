import { Category } from '../../domain/models/category';
import { BaseService } from './base.service';

export interface CategoryService extends BaseService<Category> {
    findAll() : Promise<any[]>;
    findOne(filters) : Promise<any>;
    addOne(model: Category): Promise<any>;
    editOne(model: Category): Promise<any>;
    removeOne(model: Category): Promise<any>;
}