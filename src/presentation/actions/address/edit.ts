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

@provide(IOC_TYPE.EditAddressAction, true)
@provide('action', true)
export class EditAddressAction implements IAction {
  payloadExample = `
    "_key": "123456",
    "country": "BUGIS",
    "block": "BUGIS Address",
    "propertyName": "",
    "street": "",
    "unit": "",
    "province": "",
    "city": "",
    "postal": "",
    "isDefault": "",
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.AddressServiceImpl) public addressService: AddressService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request._key) == true) return -1; // Address key is empty!
    if (isEmptyObject(request.country) == true) return -2; // Country is empty!
    if (isEmptyObject(request.propertyName) == true) return -3; // Property name is empty!
    if (isEmptyObject(request.street) == true) return -4; // Street is empty!
    if (isEmptyObject(request.unit) == true) return -5; // Unit is empty!
    if (isEmptyObject(request.postal) == true) return -6; // Postal is empty!

    const model = new Address();
    model._key = request._key;
    model.isActive = true;

    const filters = {_key: model._key, isActive: model.isActive};
    const address = await this.addressService.findOneBy(filters);
    if (isEmptyObject(address) == true) return -7; // Address isnot exist!;
    
    address.country = request.country;
    if (isEmptyObject(request.block) == false) address.block = request.block;
    address.propertyName = request.propertyName;
    address.street = request.street;
    address.unit = request.unit;
    if (isEmptyObject(request.province) == false) address.province = request.province;
    if (isEmptyObject(request.city) == false) address.city = request.city;
    address.postal = request.postal;
    if (isEmptyObject(request.isDefault) == false) address.isDefault = request.isDefault;
    address.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    address.userLastUpdated = token.email;
    
    return await this.addressService.editOne(address);
  }
}