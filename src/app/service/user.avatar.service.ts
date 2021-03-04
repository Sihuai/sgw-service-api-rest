import { UserAvatar } from '../../domain/models/user.avatar';
import { BaseService } from './base.service';

export interface UserAvatarService extends BaseService<UserAvatar> {
    findAll() : Promise<UserAvatar[]>;
    findAllBy(filters) : Promise<UserAvatar[]>;
    findAllByKey(keys) : Promise<UserAvatar[]>;
    findOneBy(filters) : Promise<UserAvatar>;
    addOne(userkey: string, model: UserAvatar): Promise<any>;
    removeOne(userkey: string, model: UserAvatar): Promise<any>;
}