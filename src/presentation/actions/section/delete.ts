import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionService } from '../../../app/service/section.service';
import { IOC_TYPE } from '../../../config/type';
import { ISectionDTO, Section } from '../../../domain/models/section';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ISectionDTO> {
  _key: string;
}

@provide(IOC_TYPE.DeleteSectionAction, true)
@provide('action', true)
export class DeleteSectionAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionServiceImpl) public sectionService: SectionService,
  ) {}
  execute(request: IRequest) {
    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    
    const model = new Section();
    model._key = request._key;

    return this.sectionService.removeOne(model);
  }
}
