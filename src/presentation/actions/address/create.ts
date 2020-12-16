import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AddressService } from '../../../app/service/address.service';
import { IOC_TYPE } from '../../../config/type';
import { IAddressDTO } from '../../../domain/dtos/i.address.dto';
import { Address } from '../../../domain/models/address';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IAddressDTO> {
  userkey: string;
  country: string;
  block: string;
  propertyName: string;
  street: string;
  unit: string;
  province?: string;
  city?: string;
  postal?: string;
  isDefault: boolean;
}

@provide(IOC_TYPE.CreateAddressAction, true)
@provide('action', true)
export class CreateAddressAction implements IAction {
  payloadExample = `
  {
    "userkey": 1,
    "country": "BUGIS",
    "block": "BUGIS Address",
    "propertyName": "",
    "street": "",
    "unit": "",
    "province": "",
    "city": "",
    "postal": "",
    "isDefault": "",
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.AddressServiceImpl) public addressService: AddressService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request.userkey) == true) return -1; // User key is empty!
    if (isEmptyObject(request.country) == true) return -2; // Country is empty!
    if (isEmptyObject(request.propertyName) == true) return -3; // Property name is empty!
    if (isEmptyObject(request.street) == true) return -4; // Street is empty!
    if (isEmptyObject(request.unit) == true) return -5; // Unit is empty!
    if (isEmptyObject(request.postal) == true) return -6; // Postal is empty!

    const model = new Address();
    model.country = request.country;
    model.block = request.block;
    model.propertyName = request.propertyName;
    model.street = request.street;
    model.unit = request.unit;
    model.province = request.province;
    model.city = request.city;
    model.postal = request.postal;
    model.isDefault = request.isDefault;
    
    return await this.addressService.addOne(request.userkey, model);
  }
}