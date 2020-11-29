import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { BillBoard, IBillBoardDTO } from '../../../domain/models/bill.board';
import { Category } from '../../../domain/models/category';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IBillBoardDTO> {
  type: number;
  contents: Category[];
}

@provide(IOC_TYPE.CreateBillBoardAction, true)
@provide('action', true)
export class CreateBillBoardAction implements IAction {
  payloadExample = `
    "type": 1,
    "contents": [],
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (request.type <= 0) return -1; // Type is empty!
    if (request.contents.length == 0) return -2; // Contents is empty!

    const model = new BillBoard();
    model.type = request.type;
    model.contents = request.contents;
    
    return await this.billBoardService.addOne(model);
  }
}