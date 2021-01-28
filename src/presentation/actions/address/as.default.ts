import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { AddressService } from '../../../app/service/address.service';
import { IOC_TYPE } from '../../../config/type';
import { IAddressDTO } from '../../../domain/dtos/i.address.dto';
import { Address } from '../../../domain/models/address';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IAddressDTO> {
  _key: string;
  isDefault: boolean;
}

@provide(IOC_TYPE.AsDefaultAction, true)
@provide('action', true)
export class AsDefaultAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.AddressServiceImpl) private addressService: AddressService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request._key) == true) return -1; // Address key is empty!

    const model = new Address();
    model._key = request._key;
    model.isActive = true;

    const filters = {_key: model._key, isActive: model.isActive};
    const address = await this.addressService.findOneBy(filters);
    if (isEmptyObject(address) == true) return -7; // Address isnot exist!;
    
    address.isDefault = request.isDefault;
    address.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    address.userLastUpdated = token.email;
    
    return await this.addressService.editOne(address);
  }
}