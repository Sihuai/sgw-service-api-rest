import { Order } from '../../domain/models/order';
import { BaseService } from './base.service';

export interface OrderService extends BaseService<Order> {
    page(filters, pageIndex: number, pageSize: number) : Promise<any>;
    findAllBy(filters) : Promise<Order[]>;
    findAllByKey(key) : Promise<Order[]>;
    findOneBy(filters) : Promise<any>;
    addOne(email: string, addressKey: string, filters): Promise<any>;
    editOne(model: Order): Promise<any>;
    removeOne(model: Order): Promise<any>;
}