import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionTrailService } from '../../../app/service/section.trail.service';
import { IOC_TYPE } from '../../../config/type';
import { ISectionTrailDTO, SectionTrail } from '../../../domain/models/section.trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ISectionTrailDTO> {
  sectionid: string;
  trialid: string;
}

@provide(IOC_TYPE.CreateSectionTrailAction, true)
@provide('action', true)
export class CreateSectionTrailAction implements IAction {
  payloadExample = `
  {
    "sectionid": "Section/2589592",
    "trialid": "Trail/1758453"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionTrailServiceImpl) public sectionTrailService: SectionTrailService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request.sectionid) == true) return -1; // Section ID is empty!
    if (isEmptyObject(request.trialid) == true) return -2; // Trial ID is empty!

    const model = new SectionTrail();
    model._from = request.sectionid;
    model._to = request.trialid;
    
    return await this.sectionTrailService.addOne(model);
  }
}