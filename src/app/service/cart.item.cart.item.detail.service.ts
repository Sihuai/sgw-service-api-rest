import { CartItemCartItemDetail } from '../../domain/models/cart.item.cart.item.detail';
import { BaseService } from './base.service';

export interface CartItemCartItemDetailService extends BaseService<CartItemCartItemDetail> {
    findAllBy(filters) : Promise<CartItemCartItemDetail[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: CartItemCartItemDetail): Promise<any>;
    removeOne(model: CartItemCartItemDetail): Promise<any>;
    removeBy(filters): Promise<any>;
}