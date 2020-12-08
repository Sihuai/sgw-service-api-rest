import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { HomeServiceImpl } from '../../../app/service/impl/home.service.impl';
import { IOC_TYPE } from '../../../config/type';

@provide(IOC_TYPE.GetHomeAction, true)
@provide('action', true)
export class GetHomeAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.HomeServiceImpl) public homeService: HomeServiceImpl,
  ) { }
  async execute() {
    return this.homeService.findAll();
  }
}