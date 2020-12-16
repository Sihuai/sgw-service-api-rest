import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { number } from 'joi';
import { OptionTypeService } from '../../../app/service/option.type.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetOptionTypeAction, true)
@provide('action', true)
export class GetOptionTypeAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.OptionTypeServiceImpl) public optionTypeService: OptionTypeService,
  ) { }
  async execute(type: number) : Promise<any>  {

    if (isEmptyObject(type) == true) return -1; // Type is empty!

    const filters = {type: ~~type, isActive: true};
    return await this.optionTypeService.findAllBy(filters);
  }
}