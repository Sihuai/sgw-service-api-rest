import { CartTrailProduct } from '../../domain/models/cart.trail.product';
import { BaseService } from './base.service';

export interface CartTrailProductService extends BaseService<CartTrailProduct> {
    findAllBy(filters) : Promise<CartTrailProduct[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: CartTrailProduct): Promise<any>;
    removeOne(model: CartTrailProduct): Promise<any>;
    removeBy(filters): Promise<any>;
}