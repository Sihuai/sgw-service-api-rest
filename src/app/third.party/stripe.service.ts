import { IPaymentAccountDTO } from "../../domain/dtos/i.payment.account.dto";

export interface StripeService {
    findAllByKey(key) : Promise<any>;
    attach(user, customerID, dto: IPaymentAccountDTO): Promise<any>;
    detach(paymentMethodID: string): Promise<any>;
    deleteOne(customerID: string): Promise<boolean>;
    pay(total: number, currency: string, customerID: string, paymentMethodID: string): Promise<any>;
}