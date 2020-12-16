import { CartCartDetail } from '../../domain/models/cart.cart.detail';
import { BaseService } from './base.service';

export interface CartCartDetailService extends BaseService<CartCartDetail> {
    findAllBy(filters) : Promise<CartCartDetail[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: CartCartDetail): Promise<any>;
    removeOne(model: CartCartDetail): Promise<any>;
    removeBy(filters): Promise<any>;
}