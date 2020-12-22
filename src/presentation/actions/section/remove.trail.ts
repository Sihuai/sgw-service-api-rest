import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionTrailService } from '../../../app/service/section.trail.service';
import { IOC_TYPE } from '../../../config/type';
import { SectionTrail } from '../../../domain/models/section.trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteSectionTrailAction, true)
@provide('action', true)
export class DeleteSectionTrailAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionTrailServiceImpl) private sectionTrailService: SectionTrailService,
  ) {}
  execute(token, key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new SectionTrail();
    model._key = key;
    model.userLastUpdated = token.email;
    
    return this.sectionTrailService.removeOne(model);
  }
}
