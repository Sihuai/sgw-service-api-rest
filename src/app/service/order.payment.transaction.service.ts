import { OrderPaymentTransaction } from '../../domain/models/order.payment.transaction';
import { BaseService } from './base.service';

export interface OrderPaymentTransactionService extends BaseService<OrderPaymentTransaction> {
    findAllBy(filters) : Promise<OrderPaymentTransaction[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: OrderPaymentTransaction): Promise<any>;
    removeOne(model: OrderPaymentTransaction): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}