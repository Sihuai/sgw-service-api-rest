import { IPaymentAccountDTO } from '../../domain/dtos/i.payment.account.dto';
import { PaymentAccount } from '../../domain/models/payment.account';
import { BaseService } from './base.service';

export interface PaymentAccountService extends BaseService<PaymentAccount> {
    findAllBy(filters) : Promise<any>;
    findAllByKey(key) : Promise<PaymentAccount[]>;
    findOneBy(filters) : Promise<PaymentAccount>;
    addOne(email: string, dto: IPaymentAccountDTO): Promise<any>;
    removeOne(model: PaymentAccount): Promise<any>;
    deleteOne(model: PaymentAccount): Promise<any>;
}