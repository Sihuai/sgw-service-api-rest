import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionService } from '../../../app/service/section.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.PagingSectionAction, true)
@provide('action', true)
export class PagingSectionAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionServiceImpl) public sectionService: SectionService,
  ) { }
  async execute(key: string, index: number) : Promise<any>  {
    return await this.sectionService.page(key, index, 10);
  }
}