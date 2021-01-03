import { CartItemOrderItem } from '../../domain/models/cart.item.order.item';
import { BaseService } from './base.service';

export interface CartItemOrderItemService extends BaseService<CartItemOrderItem> {
    findAllBy(filters) : Promise<CartItemOrderItem[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: CartItemOrderItem): Promise<any>;
    removeOne(model: CartItemOrderItem): Promise<any>;
}