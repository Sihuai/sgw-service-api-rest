import { CartProduct } from '../../domain/models/cart.product';
import { BaseService } from './base.service';

export interface CartProductService extends BaseService<CartProduct> {
    findAllBy(filters) : Promise<CartProduct[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: CartProduct): Promise<any>;
    removeOne(model: CartProduct): Promise<any>;
    removeBy(filters): Promise<any>;
}