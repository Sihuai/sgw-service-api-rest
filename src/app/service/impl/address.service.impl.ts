import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { Address } from '../../../domain/models/address';
import { UserAddress } from '../../../domain/models/user.address';
import { AddressRepo } from '../../../infra/repository/address.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { AddressService } from '../address.service';
import { UserAddressService } from '../user.address.service';
import { UserService } from '../user.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.AddressServiceImpl)
export class AddressServiceImpl extends AbstractBaseService<Address> implements AddressService {
  constructor(
    @inject(IOC_TYPE.AddressRepoImpl) private addressRepo: AddressRepo,
    @inject(IOC_TYPE.UserAddressServiceImpl) private userAddressService: UserAddressService,
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
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

  async findAllByKey(key) : Promise<Address[]> {
    return await this.addressRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<Address> {
    return await this.addressRepo.selectOneBy(filters);
  }

  async addOne(model: Address): Promise<any> {
    try {
      const userFilters = {email:model.userCreated, isActive:true};
      const user = await this.userService.findOneBy(userFilters);
      const addresses = await this.findAllBy({_from: 'Users/' + user._key});

      if (isEmptyObject(addresses) == true || addresses == -10) {
        model.isDefault = false
      } else {
        if (model.isDefault == true) {
          for (let address of addresses) {
            if (address.isDefault == true) {
              address.isDefault = false;
              address.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
              address.userLastUpdated = model.userLastUpdated;

              const aResult = await this.addressRepo.update(address);
              if (isEmptyObject(aResult) == true) return -11;
            }
          }
        }
      }
      
      // 1. Insert into address
      const result = await this.addressRepo.insert(model);
      // 2. Insert into UserAddress
      const userAddress = new UserAddress();
      userAddress._from = 'Users/' + user._key;
      userAddress._to = 'Address/' + result._key;
      const uaResult = await this.userAddressService.addOne(userAddress);
      if (isEmptyObject(uaResult) == true) return -12;

      return result;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Address): Promise<any> {
    try {
      if (model.isDefault == true) {
        const userFilters = {email:model.userLastUpdated, isActive:true};
        const user = await this.userService.findOneBy(userFilters);

        const addresses = await this.findAllBy({_from: 'Users/' + user._key});
        if (isEmptyObject(addresses) == false && addresses != -10) {
          for (let address of addresses) {
            if (address.isDefault == true) {
              address.isDefault = false;
              address.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
              address.userLastUpdated = model.userLastUpdated;
              
              const aResult = await this.addressRepo.update(address);
              if (isEmptyObject(aResult) == true) return -11;
            }
          }
        }
      }

      return await this.addressRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Address): Promise<any> {
    try {
      const result = await this.addressRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;
  
      // 1. Remove user address relation collection
      const uaFilters = {_to: 'Address/' + result[0]._key, isActive:true};
      const uaResult = await this.userAddressService.removeBy(model.userLastUpdated, uaFilters);
      if (uaResult == -10) return -10;
      if (uaResult == false) return -13;
      
      // 2. Remove address collection
      result[0].isActive = false;
      result[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      result[0].userLastUpdated = model.userLastUpdated;

      return await this.editOne(result[0]);
    } catch (e) {
      throw e;
    }
  }
}