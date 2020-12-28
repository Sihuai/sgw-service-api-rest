import { CartItem } from '../../domain/models/cart.item';
import { BaseService } from './base.service';

export interface CartItemService extends BaseService<CartItem> {
    findAll() : Promise<CartItem[]>;
    findAllBy(filters) : Promise<CartItem[]>;
    findAllByKey(filters) : Promise<CartItem[]>;
    findOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(typekey: string, cartItem: CartItem): Promise<any>;
    editOne(model: CartItem): Promise<any>;
    removeOne(model: CartItem): Promise<any>;
}