import { Product } from '../../domain/models/product';
import { BaseService } from './base.service';

export interface ProductService extends BaseService<Product> {
    findAll() : Promise<Product[]>;
    findAllBy(filters) : Promise<Product[]>;
    findAllByKey(keys) : Promise<Product[]>;
    findOneBy(filters) : Promise<Product>;
    addOne(model: Product): Promise<any>;
    editOne(model: Product): Promise<any>;
    removeOne(model: Product): Promise<any>;
}