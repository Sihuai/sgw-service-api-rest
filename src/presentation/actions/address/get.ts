import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AddressService } from '../../../app/service/address.service';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../base.action';

@provide(IOC_TYPE.GetAddressAction, true)
@provide('action', true)
export class GetAddressAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.AddressServiceImpl) private addressService: AddressService,
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) { }
  async execute(token) : Promise<any>  {

    const userFilters = {email:token.email, isActive:true};
    const user = await this.userService.findOneBy(userFilters);

    const addrFilters = {_from: 'Users/' + user._key, isActive: true};
    return await this.addressService.findAllBy(addrFilters);
  }
}