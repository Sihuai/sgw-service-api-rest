import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OptionTypeService } from '../../../app/service/option.type.service';
import { IOC_TYPE } from '../../../config/type';
import { IOptionTypeDTO } from '../../../domain/dtos/i.option.type.dto';
import { OptionType } from '../../../domain/models/option.type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IOptionTypeDTO> {
  type: number;
  code: string;
  name: string;
  sequence: number;
  selected: boolean;
}

@provide(IOC_TYPE.CreateOptionTypeAction, true)
@provide('action', true)
export class CreateOptionTypeAction implements IAction {
  payloadExample = `
  {
    "type": 1,
    "code": "BUGIS",
    "name": "BUGIS OptionType",
    "sequence": 0,
    "selected": true
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.OptionTypeServiceImpl) private optionTypeService: OptionTypeService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (request.type < 0) return -1; // Type is empty!
    if (isEmptyObject(request.code) == true) return -2; // Code is empty!
    if (isEmptyObject(request.name) == true) return -3; // Name is empty!
    if (request.sequence < 0) return -4; // Sequence is empty!

    const model = new OptionType();
    model.type = request.type;
    model.code = request.code;
    model.name = request.name;
    model.sequence = request.sequence;
    model.selected = request.selected === undefined ? false : request.selected;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.optionTypeService.addOne(model);
  }
}