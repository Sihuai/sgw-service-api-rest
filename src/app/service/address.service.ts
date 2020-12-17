import { Address } from '../../domain/models/address';
import { BaseService } from './base.service';

export interface AddressService extends BaseService<Address> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<any>;
    findOneBy(filters) : Promise<Address>;
    addOne(userkey: string, model: Address): Promise<any>;
    editOne(model: Address): Promise<any>;
    removeOne(model: Address): Promise<any>;
}