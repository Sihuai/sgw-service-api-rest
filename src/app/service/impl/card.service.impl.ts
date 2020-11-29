import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { Card } from '../../../domain/models/card';
import { CardRepo } from '../../../infra/repository/card.repo';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CardService } from '../card.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CardServiceImpl)
export class CardServiceImpl extends AbstractBaseService<Card> implements CardService {
  constructor(
    @inject(IOC_TYPE.CardRepoImpl) private cardRepo: CardRepo,
  ) {
    super();
  }

  async findAll() : Promise<Card[]> {
    return await this.cardRepo.selectAll();
  }

  async page(filters) : Promise<any> {
    return await this.cardRepo.page(filters);
  }

  async findAllBy(filters) : Promise<Card> {
    return await this.cardRepo.selectAllBy(filters);
  }

  async findOne(filters) : Promise<Card> {
    return await this.cardRepo.selectOneBy(filters);
  }

  async addOne(model: Card): Promise<any> {
    try {
      return await this.cardRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: Card): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.cardRepo.existsBy(filters);
      if (isExisted == false) return -3; // Bill board information is not exist!

      const result = this.removeOne(model);

      return await this.addOne(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: Card): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOne(filters);
      if (result == null) return -3; // Bill board information is not exist!
  
      return await this.cardRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}