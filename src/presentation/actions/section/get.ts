import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionService } from '../../../app/service/section.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetSectionAction, true)
@provide('action', true)
export class GetSectionAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionServiceImpl) private sectionService: SectionService,
  ) { }
  async execute() : Promise<any>  {
    return await this.sectionService.findAll();
  }
}