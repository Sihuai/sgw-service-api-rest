import { Cart } from '../../domain/models/cart';
import { CartDetail } from '../../domain/models/cart.detail';
import { BaseService } from './base.service';

export interface CartService extends BaseService<Cart> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<Cart>;
    findAllByKey(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(typekey: string, cart: Cart, cartDetail: CartDetail): Promise<any>;
    editOne(model: Cart): Promise<any>;
    removeOne(model: Cart): Promise<any>;
}