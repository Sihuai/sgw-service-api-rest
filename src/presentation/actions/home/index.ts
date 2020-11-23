import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { HomeService } from '../../../app/service/home.service';
import { IOC_TYPE } from '../../../config/type';

@provide(IOC_TYPE.IndexHomeAction, true)
@provide('action', true)
export class IndexHomeAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.HomeServiceImpl) public homeService: HomeService,
  ) { }
  async execute() {
    return this.homeService.find();
  }
}