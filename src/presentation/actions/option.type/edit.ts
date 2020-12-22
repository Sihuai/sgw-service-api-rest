import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { OptionTypeService } from '../../../app/service/option.type.service';
import { IOC_TYPE } from '../../../config/type';
import { IOptionTypeDTO } from '../../../domain/dtos/i.option.type.dto';
import { OptionType } from '../../../domain/models/option.type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IOptionTypeDTO> {
  _key: string;
  isActive: boolean;
  type: number;
  code: string;
  name: string;
  sequence: number;
  selected: boolean;
}

@provide(IOC_TYPE.EditOptionTypeAction, true)
@provide('action', true)
export class EditOptionTypeAction implements IAction {
  payloadExample = `
    "_key": "123456",
    "isActive": True,
    "type": 1,
    "code": "BUGIS",
    "name": "BUGIS OptionType",
    "sequence": 0,
    "selected": false
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.OptionTypeServiceImpl) private optionTypeService: OptionTypeService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request.code) == true) return -2; // Code is empty!
    if (isEmptyObject(request.name) == true) return -3; // Name is empty!
    if (request.sequence < 0) return -4; // Sequence is empty!
    if (isEmptyObject(request._key) == true) return -5;      // Key is empty!
    if (request.type <= 0) return -6; // Type is less than zero!

    const model = new OptionType();
    model._key = request._key;
    model.isActive = request.isActive === undefined ? true : request.isActive;
    model.type = request.type;
    model.code = request.code;
    model.name = request.name;
    model.sequence = request.sequence;
    model.selected = request.selected === undefined ? false : request.selected;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;
    
    return await this.optionTypeService.editOne(model);
  }
}