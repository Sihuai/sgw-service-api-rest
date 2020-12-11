import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO } from '../../../domain/dtos/i.user.dto';
import { Address } from '../../../domain/models/address';
import { User } from '../../../domain/models/user';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IUserDTO> {
  _key: string;
  firstName: string;
  lastName: string;
  userName: string;
  nick: string;
  address: Address;
}

@provide(IOC_TYPE.EditUserAction, true)
@provide('action', true)
export class EditUserAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    if (isEmptyObject(request.nick) == true) return -2; // Nike is empty!

    const model = new User();
    model._key = request._key;
    model.firstName = request.firstName;
    model.lastName = request.lastName;
    model.userName = request.userName;
    model.nick = request.nick;
    model.address = request.address;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = model.email;
    
    return await this.userService.editOne(model);
  }
}