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
    @inject(IOC_TYPE.UserServiceImpl) public userService: UserService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request._key) == true) return -1; // Key is empty!

    const model = new User();
    model._key = request._key;
    model.isActive = true;

    const filters = {_key: model._key, isActive: model.isActive};
    const user = await this.userService.findOneBy(filters);
    if (isEmptyObject(user) == true) return -2; // User isnot existed!;
    
    user.nameFirst = request.nameFirst;
    user.nameLast = request.nameLast;
    user.nick = request.nick;
    user.dob = request.dob;
    user.gender = request.gender;
    user.headerUri = request.headerUri;
    user.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    user.userLastUpdated = model.email;
    
    return await this.userService.editOne(user);
  }
}