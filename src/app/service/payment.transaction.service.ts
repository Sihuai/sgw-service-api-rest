import { PaymentTransaction } from '../../domain/models/payment.transaction';
import { BaseService } from './base.service';

export interface PaymentTransactionService extends BaseService<PaymentTransaction> {
    addOne(email: string, orderKey: string, paymentAccountKey: string): Promise<any>;
}