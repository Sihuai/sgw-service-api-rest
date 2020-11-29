import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetBillBoardAction, true)
@provide('action', true)
export class GetBillBoardAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
  ) { }
  async execute() : Promise<any>  {
    return await this.billBoardService.findAll();
  }
}