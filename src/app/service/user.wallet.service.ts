import { UserWallet } from '../../domain/models/user.wallet';
import { BaseService } from './base.service';

export interface UserWalletService extends BaseService<UserWallet> {
    findAll() : Promise<UserWallet[]>;
    findAllBy(filters) : Promise<UserWallet[]>;
    findAllByKey(keys) : Promise<UserWallet[]>;
    findOneBy(filters) : Promise<UserWallet>;
    addOne(model: UserWallet): Promise<any>;
    editOne(model: UserWallet): Promise<any>;
    removeOne(model: UserWallet): Promise<any>;
}