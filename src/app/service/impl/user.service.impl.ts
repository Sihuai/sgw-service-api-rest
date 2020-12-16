import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { ResetToken, User } from '../../../domain/models/user';
import { UserRepo } from '../../../infra/repository/user.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { createVerificationCode } from '../../../infra/utils/security';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { UserService } from '../user.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserServiceImpl)
export class UserServiceImpl extends AbstractBaseService<User> implements UserService {
  constructor(
    @inject(IOC_TYPE.UserRepoImpl) private userRepo: UserRepo,
  ) {
    super();
  }

  async findAll(filters) : Promise<User[]> {
    return await this.userRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<User> {
    return await this.userRepo.selectOneBy(filters);
  }

  async addOne(model: User): Promise<any> {
    try {
      const filters = {email: model.email, isActive: model.isActive};
      const isExisted = await this.userRepo.existsBy(filters);
      if (isExisted == true) return -10; // Email has been used by another User!

      return await this.userRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: User): Promise<User> {
    try {
      return await this.userRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: User): Promise<any> {
    try {
      const filters = {email: model.email, isActive: model.isActive};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -13; // User isnot existed!
  
      return await this.userRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }

  async resetPWRequest(filters): Promise<any> {
    try {
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10; // No user.

      const vcode = await createVerificationCode();
      const datetimeNow = moment();

      const resetToken = new ResetToken();
      resetToken.dateRequested = datetimeNow.utc().format('YYYY-MM-DD HH:mm:ss');
      resetToken.dateExpires = datetimeNow.utc().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      resetToken.code = vcode;
      resetToken.resolved = false;

      result.resetToken = resetToken;

      return await this.userRepo.update(result);
    } catch(e) {
      throw e;
    }
  }

  async resetPWExecute(filters, pwhash: string): Promise<any> {
    try {
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10; // No user.

      const vcode = await createVerificationCode();
      const datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss');

      if (result.resetToken != undefined && result.resetToken.resolved == true) return -11; // Had reset.
      if (result.resetToken != undefined && result.resetToken.dateExpires <= datetimeNow) return -12; // expired.

      const resetToken = new ResetToken();
      resetToken.resolved = true;

      result.resetToken = resetToken;
      result.pwhash = pwhash;

      return await this.userRepo.update(result);
    } catch(e) {
      throw e;
    }
  }
}
