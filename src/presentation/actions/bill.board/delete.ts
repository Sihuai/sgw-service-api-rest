import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { IBillBoardDTO } from '../../../domain/dtos/i.bill.board.dto';
import { BillBoard } from '../../../domain/models/bill.board';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteBillBoardAction, true)
@provide('action', true)
export class DeleteBillBoardAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
  ) {}
  execute(key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new BillBoard();
    model._key = key;

    return this.billBoardService.removeOne(model);
  }
}