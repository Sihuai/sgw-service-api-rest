import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AddressService } from '../../../app/service/address.service';
import { IOC_TYPE } from '../../../config/type';
import { Address } from '../../../domain/models/address';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.DeleteAddressAction, true)
@provide('action', true)
export class DeleteAddressAction implements IAction {
  payloadExample = 'key: "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.AddressServiceImpl) public addressService: AddressService,
  ) {}
  execute(key: string) {
    if (isEmptyObject(key) == true) return -1; // Key is empty!
    
    const model = new Address();
    model._key = key;

    return this.addressService.removeOne(model);
  }
}
