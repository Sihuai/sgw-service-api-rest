import { OrderItemUserAnimationPlayback } from '../../domain/models/order.item.user.animation.playback';
import { BaseService } from './base.service';

export interface OrderItemUserAnimationPlaybackService extends BaseService<OrderItemUserAnimationPlayback> {
    findAllBy(filters) : Promise<OrderItemUserAnimationPlayback[]>;
    page(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: OrderItemUserAnimationPlayback): Promise<any>;
    removeOne(model: OrderItemUserAnimationPlayback): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}