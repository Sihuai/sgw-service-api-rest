import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { BillBoard, IBillBoardDTO } from '../../../domain/models/bill.board';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IBillBoardDTO> {
  _key: string;
}

@provide(IOC_TYPE.DeleteBillBoardAction, true)
@provide('action', true)
export class DeleteBillBoardAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
  ) {}
  execute(request: IRequest) {
    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    
    const model = new BillBoard();
    model._key = request._key;

    return this.billBoardService.removeOne(model);
  }
}
