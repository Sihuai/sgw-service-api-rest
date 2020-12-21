import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserAddress } from '../../../domain/models/user.address';
import { UserAddressRepo } from '../../../infra/repository/user.address.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { UserAddressService } from '../user.address.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserAddressServiceImpl)
export class UserAddressServiceImpl extends AbstractBaseService<UserAddress> implements UserAddressService {
  constructor(
    @inject(IOC_TYPE.UserAddressRepoImpl) private userAddressRepo: UserAddressRepo,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<UserAddress[]> {
    return await this.userAddressRepo.selectAllBy(filters);
  }

  async page(filters) : Promise<any> {
    return await this.userAddressRepo.page(filters);
  }

  async findOneBy(filters) : Promise<UserAddress> {
    return await this.userAddressRepo.selectOneBy(filters);
  }

  async addOne(model: UserAddress): Promise<any> {
    try {
      return await this.userAddressRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(model: UserAddress): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      return await this.userAddressRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }

  async removeBy(user: string, filters): Promise<any> {
    try {
      const result = await this.findAllBy(filters);
      if (isEmptyObject(result) == true) return -10;
  
      for (let data of result) {
        data.isActive = false;
        data.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        data.userLastUpdated = user;

        const updateResult = await this.userAddressRepo.update(data);
        if (isEmptyObject(updateResult) == true) return false;
      }

      return true;
      // const keys: Array<string> = [];
      // for (let data of result) {
      //   keys.push(data._key);
      // }

      // return await this.userAddressRepo.deleteByKey(keys);
    } catch (e) {
      throw e;
    }
  }
}