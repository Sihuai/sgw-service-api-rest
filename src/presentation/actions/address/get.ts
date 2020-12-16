import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AddressService } from '../../../app/service/address.service';
import { IOC_TYPE } from '../../../config/type';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetAddressAction, true)
@provide('action', true)
export class GetAddressAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.AddressServiceImpl) public addressService: AddressService,
  ) { }
  async execute(userkey: string) : Promise<any>  {

    if (isEmptyObject(userkey) == true) return -1; // User key is empty!

    const filters = {_from: 'Users/' + userkey};
    return await this.addressService.findAllBy(filters);
  }
}