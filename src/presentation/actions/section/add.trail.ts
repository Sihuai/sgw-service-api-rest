import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionTrailService } from '../../../app/service/section.trail.service';
import { IOC_TYPE } from '../../../config/type';
import { ISectionTrailDTO, SectionTrail } from '../../../domain/models/section.trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ISectionTrailDTO> {
  sectionkey: string;
  trailkey: string;
}

@provide(IOC_TYPE.CreateSectionTrailAction, true)
@provide('action', true)
export class CreateSectionTrailAction implements IAction {
  payloadExample = `
  {
    "sectionkey": "2589592",
    "trailkey": "1758453"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionTrailServiceImpl) private sectionTrailService: SectionTrailService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request.sectionkey) == true) return -1; // Section Key is empty!
    if (isEmptyObject(request.trailkey) == true) return -2; // Trail Key is empty!

    const model = new SectionTrail();
    model._from = 'Section/' + request.sectionkey;
    model._to = 'Trail/' + request.trailkey;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.sectionTrailService.addOne(model);
  }
}