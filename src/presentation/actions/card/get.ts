import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CardService } from '../../../app/service/card.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetCardAction, true)
@provide('action', true)
export class GetCardAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.CardServiceImpl) public cardService: CardService,
  ) { }
  async execute() : Promise<any>  {
    return await this.cardService.findAll();
  }
}