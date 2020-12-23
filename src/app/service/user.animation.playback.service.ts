import { UserAnimationPlayback } from '../../domain/models/user.animation.playback';
import { BaseService } from './base.service';

export interface UserAnimationPlaybackService extends BaseService<UserAnimationPlayback> {
    findAllBy(filters) : Promise<UserAnimationPlayback[]>;
    page(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: UserAnimationPlayback): Promise<any>;
    removeOne(model: UserAnimationPlayback): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}