import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { UserService } from '../../../app/service/user.service';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { UserAvatarService } from '../../../app/service/user.avatar.service';
import { UserAvatar } from '../../../domain/models/user.avatar';

@provide(IOC_TYPE.AvatarRemoveAction, true)
@provide('action', true)
export class AvatarRemoveAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
    @inject(IOC_TYPE.UserAvatarServiceImpl) private userAvatarService: UserAvatarService,
  ) {}
  async execute(token) : Promise<any> {
    const filters = {email:token.email, isActive:true};
    const user = await this.userService.findOneBy(filters);
    if (isEmptyObject(user) == true) return -1; // User isnot existed!;

    const model = new UserAvatar();
    model.userLastUpdated = token.email;

    const uaResult = await this.userAvatarService.removeOne(user._key, model);

    return uaResult[0];
  }
}
