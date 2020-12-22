import { CartItem } from '../../domain/models/cart.item';
import { CartItemDetail } from '../../domain/models/cart.item.detail';
import { BaseService } from './base.service';

export interface CartItemService extends BaseService<CartItem> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<CartItem>;
    findAllByKey(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(typekey: string, cartItem: CartItem, cartItemDetail: CartItemDetail): Promise<any>;
    editOne(model: CartItem): Promise<any>;
    removeOne(model: CartItem): Promise<any>;
}