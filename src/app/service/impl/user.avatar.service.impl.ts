import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { GenericEdge } from '../../../domain/models/generic.edge';
import { UserAvatar } from '../../../domain/models/user.avatar';
import { UserAvatarRepo } from '../../../infra/repository/user.avatar.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { GenericEdgeService } from '../generic.edge.service';
import { UserAvatarService } from '../user.avatar.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserAvatarServiceImpl)
export class UserAvatarServiceImpl extends AbstractBaseService<UserAvatar> implements UserAvatarService {
  constructor(
    @inject(IOC_TYPE.UserAvatarRepoImpl) private userAvatarRepo: UserAvatarRepo,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
  ) {
    super();
  }

  async findAll() : Promise<UserAvatar[]> {
    return await this.userAvatarRepo.selectAll();
  }

  async findAllBy(filters) : Promise<UserAvatar[]> {
    return await this.userAvatarRepo.selectAllBy(filters);
  }

  async findAllByKey(keys) : Promise<UserAvatar[]> {
    return await this.userAvatarRepo.selectAllByKey(keys);
  }

  async findOneBy(filters) : Promise<UserAvatar> {
    return await this.userAvatarRepo.selectOneBy(filters);
  }

  async addOne(userkey: string, model: UserAvatar): Promise<any> {
    try {
      // 1. Get all active avatar
      const geFilters = {_to: 'User/' + userkey, tag: 'UserAvatar', isActive: true};
      const geResult = await this.genericEdgeService.findAllBy(geFilters);

      if (isEmptyObject(geResult) == false) {
        const keys: Array<string> = [];

        for (let data of geResult) {
          keys.push(data._from);

          data.isActive = false;
          data.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
          data.userLastUpdated = model.userLastUpdated;
        }
        
        const oldUAs = await this.userAvatarRepo.selectAllByKey(keys);
        for (let oldUA of oldUAs) {
          oldUA.isActive = false;
          oldUA.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
          oldUA.userLastUpdated = model.userLastUpdated;
        }

        // 2. Remove all active generic edge
        for (let data of geResult) {
          const result = await this.genericEdgeService.removeOne(data);
          if (isEmptyObject(result) == true) return -10;
        }
        // 3. Remove all active user avatar
        for (let data of oldUAs) {
          const result = await this.userAvatarRepo.update(data);
          if (isEmptyObject(result) == true) return -11;
        }
      }

      // 4. Insert into user avatar collection.
      const uaResult = await this.userAvatarRepo.insert(model);
      if (isEmptyObject(uaResult) == true) return -12;

      // 5. insert into user user avatar edge.
      const edge = new GenericEdge();
      edge._from = 'UserAvatar/' + uaResult._key;
      edge._to = 'User/' + userkey;
      edge.tag = 'UserAvatar';
      edge.userCreated = model.userCreated;
      edge.userLastUpdated = model.userLastUpdated;
      
      const edgeResult = await this.genericEdgeService.addOne(edge);
      if (isEmptyObject(edgeResult) == true) return -13;

      return uaResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async removeOne(userkey: string, model: UserAvatar): Promise<any> {
    try {
      // 1. Get all active avatar
      const geFilters = {_to: 'User/' + userkey, tag: 'UserAvatar', isActive: true};
      const geResult = await this.genericEdgeService.findAllBy(geFilters);

      if (isEmptyObject(geResult) == false) {
        const keys: Array<string> = [];

        for (let data of geResult) {
          keys.push(data._from);

          data.isActive = false;
          data.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
          data.userLastUpdated = model.userLastUpdated;
        }
        
        const oldUAs = await this.userAvatarRepo.selectAllByKey(keys);
        for (let oldUA of oldUAs) {
          oldUA.isActive = false;
          oldUA.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
          oldUA.userLastUpdated = model.userLastUpdated;
        }

        // 2. Remove all active generic edge
        for (let data of geResult) {
          const result = await this.genericEdgeService.removeOne(data);
          if (isEmptyObject(result) == true) return -10;
        }
        // 3. Remove all active user avatar
        for (let data of oldUAs) {
          const result = await this.userAvatarRepo.update(data);
          if (isEmptyObject(result) == true) return -11;
        }
      }

      return true;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }
}