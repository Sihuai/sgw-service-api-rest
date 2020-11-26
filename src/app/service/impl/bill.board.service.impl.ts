import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { BillBoard } from '../../../domain/models/bill.board';
import { BillBoardRepo } from '../../../infra/repository/bill.board.repo';
import { AppErrorUnexpected } from '../../errors/unexpected';
import { BillBoardService } from '../bill.board.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.BillBoardServiceImpl)
export class BillBoardServiceImpl extends AbstractBaseService<BillBoard> implements BillBoardService {
  constructor(
    @inject(IOC_TYPE.BillBoardRepoImpl) private sectionRepo: BillBoardRepo,
  ) {
    super();
  }

  async search() : Promise<BillBoard> {
    const result = this.sectionRepo.select("");
    return result[0]; // Bill board always one.
  }

  async add(model: BillBoard): Promise<BillBoard> {
    try {
      return await this.save(model);
    } catch (e) {
      // if (e.message.match('duplicate key value violates unique constraint')) {
      //   throw new AppErrorUserAlreadyExist(e);
      // }
      throw new AppErrorUnexpected(e);
    }
  }

  async save(model: BillBoard): Promise<any> {
    try {
      if (model._key != ''){
        // return await this.edit(model);
        return null;
      } else {
        return await this.add(model);
      }
    } catch(e) {
      throw new AppErrorUnexpected(e);
    }
  }
}
