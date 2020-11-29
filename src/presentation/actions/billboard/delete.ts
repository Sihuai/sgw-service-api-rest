import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { BillBoard } from '../../../domain/models/bill.board';
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
    if (key == '') return -1; // Key is empty!
    
    const model = new BillBoard();
    model._key = key;

    return this.billBoardService.removeOne(model);
  }
}
