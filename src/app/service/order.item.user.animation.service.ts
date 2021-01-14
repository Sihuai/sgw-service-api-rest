import { OrderItemUserAnimation } from '../../domain/models/order.item.user.animation';
import { BaseService } from './base.service';

export interface OrderItemUserAnimationService extends BaseService<OrderItemUserAnimation> {
    findAllBy(filters) : Promise<OrderItemUserAnimation[]>;
    page(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: OrderItemUserAnimation): Promise<any>;
    removeOne(model: OrderItemUserAnimation): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}