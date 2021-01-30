import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { UserAvatarService } from '../../../app/service/user.avatar.service';
import { UserService } from '../../../app/service/user.service';
import { IOC_TYPE } from '../../../config/type';
import { UserAvatar } from '../../../domain/models/user.avatar';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { IAction } from '../base.action';

@provide(IOC_TYPE.AvatarUploadAction, true)
@provide('action', true)
export class AvatarUploadAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserAvatarServiceImpl) private userAvatarService: UserAvatarService,
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
  ) {}
  async execute(token, file?: any) : Promise<any> {

    const avatar = file.buffer.toString('base64');

    if (isEmptyObject(avatar) == true) return -1; // Avatar is empty!
    
    const filters = {email: token.email, isActive: true};
    const user = await this.userService.findOneBy(filters);
    if (isEmptyObject(user) == true) return -2; // User isnot existed!;

    const model = new UserAvatar();
    model.avatar = avatar;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.userAvatarService.addOne(user._key, model);
  }
}