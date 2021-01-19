import { Address } from '../../domain/models/address';
import { BaseService } from './base.service';

export interface AddressService extends BaseService<Address> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<any>;
    findAllByKey(key) : Promise<Address[]>;
    findOneBy(filters) : Promise<Address>;
    addOne(model: Address): Promise<any>;
    editOne(model: Address): Promise<any>;
    removeOne(model: Address): Promise<any>;
}