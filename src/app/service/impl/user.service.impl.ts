import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { User } from '../../../domain/models/user';
import { UserRepo } from '../../../infra/repository/user.repo';
import { AppErrorUnexpected } from '../../errors/unexpected';
import { UserService } from '../user.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserServiceImpl)
export class UserServiceImpl extends AbstractBaseService<User> implements UserService {
  constructor(
    @inject(IOC_TYPE.UserRepoImpl) private userRepo: UserRepo,
  ) {
    super();
  }
    // async find(model: User) : Promise<User> {
    //     const user = Users.select(model);
    //     return user;
    // }
    
    async search(filters) : Promise<User> {
      const user = await this.userRepo.select(filters);
      return user;
    }

    async add(model: User): Promise<User> {
      try {
        const filters = {email: model.email, isActive: model.isActive};
        const existedUser : User = await this.search(filters);
        if (existedUser != null && existedUser.isActive == true) throw new Error(model.email + ' has been used by another User!');

        model.role = 'Guest';
        model.isActive = true;

        return await this.save(model);
      } catch (e) {
        // if (e.message.match('duplicate key value violates unique constraint')) {
        //   throw new AppErrorUserAlreadyExist(e);
        // }
        throw new AppErrorUnexpected(e);
      }
    }

    // async resetpwrequest(filters): Promise<User> {
    //   try {
    //     if (filters.email == null || filters.email == '') {
    //       throw new Error('email is empty!');
    //     }

    //     const user = Users.select(filters);
    //     if (user == null) {
    //       throw new Error(filters.email + ' is not exist!');
    //     }
    //     if (user.isActive == false) {
    //       throw new Error(filters.email + ' is not active!');
    //     }

    //     return await Users.resetpwrequest(model);
    //   } catch(e) {
    //     throw new AppErrorUnexpected(e);
    //   }
    // }

    // async resetpwexecute(filters): Promise<User> {
    //   try {
    //     if (filters.email == null || filters.email == '') {
    //       throw new Error('email is empty!');
    //     }

    //     const user = Users.select(filters);
    //     if (user == null) {
    //       throw new Error(filters.email + ' is not exist!');
    //     }
    //     if (user.isActive == false) {
    //       throw new Error(filters.email + ' is not active!');
    //     }

    //     return await Users.resetpwexecute(model);
    //   } catch(e) {
    //     throw new AppErrorUnexpected(e);
    //   }
    // }

    async save(model: User): Promise<any> {
      try {
        // if (model._key != ''){
        //   return await this.edit(model);
        // } else {
        //   return await this.userRepo.add(model);
        // }

        return null;
      } catch(e) {
        throw new AppErrorUnexpected(e);
      }
    }

    // del(model: Users) {
    //     model.remove();
    // }
}
