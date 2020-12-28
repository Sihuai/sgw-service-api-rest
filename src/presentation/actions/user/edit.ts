import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { IUserDTO } from '../../../domain/dtos/i.user.dto';
import { User } from '../../../domain/models/user';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IUserDTO> {
  _key: string;
  nameFirst: string;
  nameLast: string;
  nick: string;
  gender: string;
  dob: string;
  headerUri: string;
}

@provide(IOC_TYPE.EditUserAction, true)
@provide('action', true)
export class EditUserAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request._key) == true) return -1; // Key is empty!
    if (isEmptyObject(request.gender) == false) {
      if (request.gender != 'MALE' && request.gender != 'FEMALE') return -2; // Gender type is incorrect!
    }

    const model = new User();
    model._key = request._key;
    model.isActive = true;

    const filters = {_key: model._key, isActive: model.isActive};
    const user = await this.userService.findOneBy(filters);
    if (isEmptyObject(user) == true) return -3; // User isnot existed!;
    
    if (isEmptyObject(request.nameFirst) == false) user.nameFirst = request.nameFirst;
    if (isEmptyObject(request.nameLast) == false) user.nameLast = request.nameLast;
    if (isEmptyObject(request.nick) == false) user.nick = request.nick;
    if (isEmptyObject(request.dob) == false) user.dob = request.dob;
    if (isEmptyObject(request.gender) == false) user.gender = request.gender;
    if (isEmptyObject(request.headerUri) == false) user.headerUri = request.headerUri;
    user.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    user.userLastUpdated = user.email;
    
    return await this.userService.editOne(user);
  }
}