import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../base.action';
import { IOC_TYPE } from '../../../config/type';
import { UserService } from '../../../app/service/user.service';
import { GenericEdgeService } from '../../../app/service/generic.edge.service';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { UserAvatarService } from '../../../app/service/user.avatar.service';

@provide(IOC_TYPE.AvatarGetAction, true)
@provide('action', true)
export class AvatarGetAction implements IAction {
  payloadExample = ``;
  description = '';
  constructor(
    @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.UserAvatarServiceImpl) private userAvatarService: UserAvatarService,
  ) { }
  async execute(token) : Promise<any>  {
    const filters = {email:token.email, isActive:true};
    const user = await this.userService.findOneBy(filters);
    if (isEmptyObject(user) == true) return -1; // User isnot existed!;

    const edgeFilters = {_to: 'User/' + user._key, tag: 'UserAvatar', isActive: true};
    const edgeResult = await this.genericEdgeService.findOneBy(edgeFilters);

    const uaResult = await this.userAvatarService.findAllByKey(edgeResult._from);

    return uaResult[0];
  }
}