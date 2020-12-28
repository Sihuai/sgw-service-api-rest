import { UserPaymentAccount } from '../../domain/models/user.payment.account';
import { BaseService } from './base.service';

export interface UserPaymentAccountService extends BaseService<UserPaymentAccount> {
    findAllBy(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: UserPaymentAccount): Promise<any>;
    removeOne(model: UserPaymentAccount): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}