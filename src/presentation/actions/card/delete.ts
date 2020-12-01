import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { CardService } from '../../../app/service/card.service';
import { IOC_TYPE } from '../../../config/type';
import { Card } from '../../../domain/models/card';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteCardAction, true)
@provide('action', true)
export class DeleteCardAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.CardServiceImpl) public cardService: CardService,
  ) {}
  execute(key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Card();
    model._key = key;

    return this.cardService.removeOne(model);
  }
}
