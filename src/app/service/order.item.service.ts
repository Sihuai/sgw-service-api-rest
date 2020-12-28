import { OrderItem } from '../../domain/models/order.item';
import { BaseService } from './base.service';

export interface OrderItemService extends BaseService<OrderItem> {
    findAll() : Promise<OrderItem[]>;
    findAllBy(orderKey: string) : Promise<OrderItem[]>;
    findAllByKey(filters) : Promise<OrderItem[]>;
    findOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(model: OrderItem): Promise<any>;
    editOne(model: OrderItem): Promise<any>;
    removeOne(model: OrderItem): Promise<any>;
}