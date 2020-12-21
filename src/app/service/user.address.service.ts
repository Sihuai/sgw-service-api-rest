import { UserAddress } from '../../domain/models/user.address';
import { BaseService } from './base.service';

export interface UserAddressService extends BaseService<UserAddress> {
    findAllBy(filters) : Promise<UserAddress[]>;
    page(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: UserAddress): Promise<any>;
    removeOne(model: UserAddress): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}