import { OrderOrderItem } from '../../domain/models/order.order.item';
import { BaseService } from './base.service';

export interface OrderOrderItemService extends BaseService<OrderOrderItem> {
    findAllBy(filters) : Promise<OrderOrderItem[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: OrderOrderItem): Promise<any>;
    removeOne(model: OrderOrderItem): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}