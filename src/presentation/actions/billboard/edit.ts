import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { BillBoard, IBillBoardDTO } from '../../../domain/models/bill.board';
import { Category } from '../../../domain/models/category';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IBillBoardDTO> {
  _key: string;
  type: string;
  contents: Category[];
}

@provide(IOC_TYPE.EditBillBoardAction, true)
@provide('action', true)
export class EditBillBoardAction implements IAction {
  payloadExample = `
  {
    "_key": "123456",
    "type": 1,
    "contents": [],
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request.type) == true) return -1; // Type is empty!
    if (request.contents.length == 0) return -2; // Contents is empty!
    if (isEmptyObject(request._key) == true) return -4;      // Key is empty!
    
    const model = new BillBoard();
    model._key = request._key;
    model.type = request.type;
    model.contents = request.contents;
    model.datetimeLastEdited = moment().clone().format('YYYY-MM-DD HH:mm:ss');
    
    return await this.billBoardService.editOne(model);
  }
}