import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { OptionTypeService } from '../../../app/service/option.type.service';
import { IOC_TYPE } from '../../../config/type';
import { OptionType } from '../../../domain/models/option.type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteOptionTypeAction, true)
@provide('action', true)
export class DeleteOptionTypeAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.OptionTypeServiceImpl) public optionTypeService: OptionTypeService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new OptionType();
    model._key = key;
    model.userLastUpdated = token.email;
    
    return this.optionTypeService.removeOne(model);
  }
}
