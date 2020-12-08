import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailService } from '../../../app/service/trail.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetTrailAction, true)
@provide('action', true)
export class GetTrailAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailServiceImpl) public trailService: TrailService,
  ) { }
  async execute() : Promise<any>  {
    return await this.trailService.findAll();
  }
}