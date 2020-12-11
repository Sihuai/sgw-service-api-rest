import { Cart } from '../../domain/models/cart';
import { BaseService } from './base.service';

export interface CartService extends BaseService<Cart> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<Cart>;
    findAllByKey(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(productkey: string, model: Cart): Promise<any>;
    editOne(model: Cart): Promise<any>;
    removeOne(model: Cart): Promise<any>;
}