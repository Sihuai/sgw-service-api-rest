import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OptionTypeService } from '../../../app/service/option.type.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetOptionTypeAction, true)
@provide('action', true)
export class GetOptionTypeAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.OptionTypeServiceImpl) public optionTypeService: OptionTypeService,
  ) { }
  async execute() : Promise<any>  {
    return await this.optionTypeService.findAll();
  }
}