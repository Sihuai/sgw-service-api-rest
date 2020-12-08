import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionTrailService } from '../../../app/service/section.trail.service';
import { IOC_TYPE } from '../../../config/type';
import { ISectionTrailDTO, SectionTrail } from '../../../domain/models/section.trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ISectionTrailDTO> {
  _key: string;
}

@provide(IOC_TYPE.DeleteSectionTrailAction, true)
@provide('action', true)
export class DeleteSectionTrailAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionTrailServiceImpl) public sectionTrailService: SectionTrailService,
  ) {}
  execute(request: IRequest) {
    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    
    const model = new SectionTrail();
    model._key = request._key;

    return this.sectionTrailService.removeOne(model);
  }
}
