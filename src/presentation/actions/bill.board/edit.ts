import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { BillBoardService } from '../../../app/service/bill.board.service';
import { IOC_TYPE } from '../../../config/type';
import { IBillBoardDTO } from '../../../domain/dtos/i.bill.board.dto';
import { BillBoard } from '../../../domain/models/bill.board';
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
    @inject(IOC_TYPE.BillBoardServiceImpl) private billBoardService: BillBoardService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {
    if (isEmptyObject(request.type) == true) return -1; // Type is empty!
    if (isEmptyObject(request.contents) == true) return -2; // Contents is empty!

    for (let content of request.contents) {
      if (content.sequence < 0) return -3; // Contents's sequence less than zero!

      if (isEmptyObject(content.type) == true) return -4; // Contents's type is empty!
      if (isEmptyObject(content.orientation) == true) return -5; // Contents's orientation is empty!
      if (isEmptyObject(content.format) == true) return -6; // Contents's format is empty!
      if (isEmptyObject(content.uri) == true) return -7; // Contents'sURI is empty!

      if (isEmptyObject(content.titles) == true) return -8; // Contents's titles is empty!
      if (isEmptyObject(content.captions) == true) return -9; // Contents's captions is empty!
    }

    if (isEmptyObject(request._key) == true) return -100;      // Key is empty!
    
    const model = new BillBoard();
    model._key = request._key;
    model.type = request.type;
    model.contents = request.contents;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;

    return await this.billBoardService.editOne(model);
  }
}