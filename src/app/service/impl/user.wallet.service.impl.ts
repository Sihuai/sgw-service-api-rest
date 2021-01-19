import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserWallet } from '../../../domain/models/user.wallet';
import { UserWalletRepo } from '../../../infra/repository/user.wallet.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { UserWalletService } from '../user.wallet.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserWalletServiceImpl)
export class UserWalletServiceImpl extends AbstractBaseService<UserWallet> implements UserWalletService {
  constructor(
    @inject(IOC_TYPE.UserWalletRepoImpl) private userwalletRepo: UserWalletRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAll() : Promise<UserWallet[]> {
    return await this.userwalletRepo.selectAll();
  }

  async findAllBy(filters) : Promise<UserWallet[]> {
    return await this.userwalletRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<UserWallet[]> {
    return await this.userwalletRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<UserWallet> {
    return await this.userwalletRepo.selectOneBy(filters);
  }

  async addOne(model: UserWallet): Promise<any> {
    try {
      return await this.userwalletRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: UserWallet): Promise<any> {
    try {
      const result = await this.userwalletRepo.selectAllByKey(model._key);
      if (isEmptyObject(result) == true) return -10;

      return await this.userwalletRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: UserWallet): Promise<any> {
    try {
      const cResult = await this.userwalletRepo.selectAllByKey(model._key);
      if (isEmptyObject(cResult) == true) return -10;

      const geFilters = {_from: 'UserWallet/' + model._key, isActive: true};
      const geResult = await this.genericEdgeService.findAllBy(geFilters);
      if (isEmptyObject(geResult) == false) return -11; // Exist GenericEdge data!
  
      cResult[0].isActive = false;
      cResult[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      cResult[0].userLastUpdated = model.userLastUpdated;

      return await this.userwalletRepo.update(cResult[0]);
    } catch (e) {
      throw e;
    }
  }
}