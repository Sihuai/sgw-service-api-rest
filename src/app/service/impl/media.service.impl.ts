import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Media } from '../../../domain/models/media';
import { MediaRepo } from '../../../infra/repository/media.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { MediaService } from '../media.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.MediaServiceImpl)
export class MediaServiceImpl extends AbstractBaseService<Media> implements MediaService {
  constructor(
    @inject(IOC_TYPE.MediaRepoImpl) private mediaRepo: MediaRepo,
  ) {
    super();
  }

  async findAll() : Promise<Media[]> {
    return await this.mediaRepo.selectAll();
  }

  async findOneBy(filters) : Promise<Media> {
    return await this.mediaRepo.selectOneBy(filters);
  }

  async addOne(model: Media): Promise<any> {
    try {
      return await this.mediaRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Media): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.mediaRepo.existsBy(filters);
      if (isExisted == false) return -3;

      const result = this.removeOne(model);

      return await this.addOne(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Media): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOneBy(filters);
      if (isEmptyObject(result) == true) return -3;
  
      return await this.mediaRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}