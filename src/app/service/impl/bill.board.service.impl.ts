import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { BillBoard } from '../../../domain/models/bill.board';
import { BillBoardRepo } from '../../../infra/repository/bill.board.repo';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { BillBoardService } from '../bill.board.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.BillBoardServiceImpl)
export class BillBoardServiceImpl extends AbstractBaseService<BillBoard> implements BillBoardService {
  constructor(
    @inject(IOC_TYPE.BillBoardRepoImpl) private billBoardRepo: BillBoardRepo,
  ) {
    super();
  }

  async findAll() : Promise<BillBoard[]> {
    return await this.billBoardRepo.selectAll();
  }

  async findAllBy(filters) : Promise<BillBoard> {
    return await this.billBoardRepo.selectAllBy(filters);
  }

  async findOne(filters) : Promise<BillBoard> {
    return await this.billBoardRepo.selectOneBy(filters);
  }

  async addOne(model: BillBoard): Promise<any> {
    try {
      return await this.billBoardRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: BillBoard): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.billBoardRepo.existsBy(filters);
      if (isExisted == false) return -10; // Bill board information is not exist!

      const result = this.removeOne(model);

      return await this.addOne(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: BillBoard): Promise<any> {
    try {
      const filters = {_key: model._key};
      const result = await this.findOne(filters);
      if (result == null) return -10; // Bill board information is not exist!
  
      return await this.billBoardRepo.deleteByKey(result._key);
    } catch (e) {
      throw e;
    }
  }
}