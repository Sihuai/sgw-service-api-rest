import { OrderAddress } from '../../domain/models/order.address';
import { BaseService } from './base.service';

export interface OrderAddressService extends BaseService<OrderAddress> {
    findAllBy(filters) : Promise<OrderAddress[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: OrderAddress): Promise<any>;
    removeOne(model: OrderAddress): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}