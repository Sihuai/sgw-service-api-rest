import { CartItemDetail } from '../../domain/models/cart.item.detail';
import { BaseService } from './base.service';

export interface CartItemDetailService extends BaseService<CartItemDetail> {
    findOneBy(cartItemKey: string) : Promise<CartItemDetail>;
}