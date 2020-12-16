import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Address } from '../../../domain/models/address';
import { UserAddress } from '../../../domain/models/user.address';
import { AddressRepo } from '../../../infra/repository/address.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { AddressService } from '../address.service';
import { UserAddressService } from '../user.address.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.AddressServiceImpl)
export class AddressServiceImpl extends AbstractBaseService<Address> implements AddressService {
  constructor(
    @inject(IOC_TYPE.AddressRepoImpl) private addressRepo: AddressRepo,
    @inject(IOC_TYPE.UserAddressServiceImpl) private userAddressService: UserAddressService,
  ) {
    super();
  }

  async findAll() : Promise<Address[]> {
    return await this.addressRepo.selectAll();
  }

  async findAllBy(filters) : Promise<any> {
    const userAddresses = await this.userAddressService.findAllBy(filters);
    if (isEmptyObject(userAddresses) == true) return -10;

    const keys: Array<string> = [];
    for (let userAddress of userAddresses) {
      keys.push(userAddress._to);
    }

    return await this.addressRepo.selectAllByKey(keys);
  }

  async addOne(userkey: string, model: Address): Promise<any> {
    try {
      if (model.isDefault == true) {
        const filters = {_from: 'Users/' + userkey};
        const addresses = await this.findAllBy(filters);
        if (isEmptyObject(addresses) == false && addresses != -10) {
          for (let address of addresses) {
            if (address.isDefault == true) return -11;
          }
        }
      }
      
      // 1. Insert into address
      const result = await this.addressRepo.insert(model);
      // 2. Insert into UserAddress
      const userAddress = new UserAddress();
      userAddress._from = 'Users/' + userkey;
      userAddress._to = result._key;
      const uaResult = await this.userAddressService.addOne(userAddress);
      if (isEmptyObject(uaResult) == true) result -12;
      if (uaResult.code != 200) return -12;

      return result;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Address): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.addressRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.addressRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Address): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.addressRepo.selectOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      // 1. Remove user address relation collection
      const uaFilters = {_from: 'Address/' + result._key};
      const uaResult = await this.userAddressService.removeBy(uaFilters);
      if (isEmptyObject(uaResult) == true) return -10;
      if (uaResult.code != 200) return -10;

      // 2. Remove address collection
      return await this.addressRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}