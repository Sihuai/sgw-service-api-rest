import { CartItemDetail } from '../../domain/models/cart.item.detail';
import { BaseService } from './base.service';

export interface CartItemDetailService extends BaseService<CartItemDetail> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<CartItemDetail>;
    findAllByKey(filters) : Promise<any>;
    findOneBy(cartItemKey: string) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(model: CartItemDetail): Promise<any>;
    editOne(model: CartItemDetail): Promise<any>;
    removeOne(model: CartItemDetail): Promise<any>;
}